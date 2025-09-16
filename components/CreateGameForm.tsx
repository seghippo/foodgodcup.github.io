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
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    opponentId: '',
    date: '',
    time: '',
    venue: ''
  });

  // Get available opponents (all teams except the user's team)
  const availableOpponents = teams.filter(team => team.id !== userTeamId);
  const userTeam = teams.find(team => team.id === userTeamId);

  // Mobile-friendly message display
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    // Auto-hide after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission on mobile
    if (isCreating) {
      return;
    }
    
    if (!formData.opponentId || !formData.date || !formData.time) {
      showMessage('error', 'Please fill in all required fields');
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
      await addGameToSchedule(newGame);
      
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
      showMessage('success', t('captain.gameCreated') || 'Game created successfully!');
    } catch (error) {
      console.error('Error creating game:', error);
      // Provide more specific error messages for mobile
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('Firebase') || errorMessage.includes('network')) {
        showMessage('error', 'Network error. Please check your connection and try again.');
      } else if (errorMessage.includes('localStorage') || errorMessage.includes('storage')) {
        showMessage('error', 'Storage error. Please try refreshing the page.');
      } else {
        showMessage('error', t('captain.gameCreationFailed') || 'Failed to create game. Please try again.');
      }
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
      
      {/* Mobile-friendly message display */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
            : message.type === 'error'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        }`}>
          {message.text}
        </div>
      )}
      
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
            className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors min-h-[44px] touch-manipulation"
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          >
            {t('captain.cancel')}
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors min-h-[44px] touch-manipulation"
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          >
            {isCreating ? t('captain.creating') : t('captain.createGame')}
          </button>
        </div>
      </form>
    </div>
  );
}
