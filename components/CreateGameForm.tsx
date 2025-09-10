'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { teams, createNewGame, addGameToSchedule, type Game } from '@/lib/data';

interface CreateGameFormProps {
  userTeamId: string;
  onGameCreated: (game: Game) => void;
}

export default function CreateGameForm({ userTeamId, onGameCreated }: CreateGameFormProps) {
  const { t, getTeamName } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    opponentId: '',
    date: '',
    time: '',
    venue: ''
  });

  // Get available opponents (all teams except the user's team)
  const availableOpponents = teams.filter(team => team.id !== userTeamId);
  const userTeam = teams.find(team => team.id === userTeamId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.opponentId || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    
    try {
      // Create new game
      const newGame = createNewGame(
        userTeamId,
        formData.opponentId,
        formData.date,
        formData.time,
        formData.venue
      );
      
      // Add to schedule
      addGameToSchedule(newGame);
      
      // Notify parent component
      onGameCreated(newGame);
      
      // Reset form
      setFormData({
        opponentId: '',
        date: '',
        time: '',
        venue: ''
      });
      setShowForm(false);
      
      // Show success message
      alert(t('captain.gameCreated'));
    } catch (error) {
      console.error('Error creating game:', error);
      alert(t('captain.gameCreationFailed'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      opponentId: '',
      date: '',
      time: '',
      venue: ''
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div className="card">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">{t('captain.createNewGame')}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t('captain.noGamesScheduled')}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            {t('captain.createNewGame')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{t('captain.createNewGame')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Home Team Display */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('captain.homeTeam')}
          </label>
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            {userTeam ? getTeamName(userTeam) : 'Unknown Team'}
          </div>
        </div>

        {/* Opponent Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('captain.selectOpponent')} *
          </label>
          <select
            value={formData.opponentId}
            onChange={(e) => handleInputChange('opponentId', e.target.value)}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            required
          >
            <option value="">{t('captain.selectOpponent')}</option>
            {availableOpponents.map(team => (
              <option key={team.id} value={team.id}>
                {getTeamName(team)}
              </option>
            ))}
          </select>
        </div>

        {/* Game Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('captain.gameDate')} *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            required
          />
        </div>

        {/* Game Time */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('captain.gameTime')} *
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
            required
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('captain.venue')}
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.target.value)}
            placeholder="Enter venue (optional)"
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {t('captain.cancel')}
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isCreating ? t('captain.creating') : t('captain.createGame')}
          </button>
        </div>
      </form>
    </div>
  );
}
