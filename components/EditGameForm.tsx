'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import { teams, type Game } from '@/lib/data';

interface EditGameFormProps {
  game: Game;
  onGameUpdated: (updatedGame: Game) => void;
  onCancel: () => void;
}

export default function EditGameForm({ game, onGameUpdated, onCancel }: EditGameFormProps) {
  const { t, getTeamName } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Early return if game is invalid
  if (!game || !game.id) {
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p>Invalid game data</p>
          <button 
            onClick={onCancel}
            className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  // Validate game object and extract date safely
  const getDateString = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr;
  };
  
  const [formData, setFormData] = useState({
    date: getDateString(game?.date || ''),
    time: game?.time || '',
    venue: game?.venue || ''
  });

  const homeTeam = teams.find(team => team.id === game?.home);
  const awayTeam = teams.find(team => team.id === game?.away);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!game || !game.id) {
      alert('Invalid game data. Please try again.');
      return;
    }
    
    if (!formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    
    try {
      // Create updated game object
      const updatedGame: Game = {
        ...game,
        date: new Date(formData.date + 'T' + formData.time).toISOString(),
        time: formData.time,
        venue: formData.venue
      };
      
      // Notify parent component and wait for completion
      await onGameUpdated(updatedGame);
      
    } catch (error) {
      console.error('Error updating game:', error);
      alert(t('captain.gameUpdateFailed'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{t('captain.editGame')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Game Info Display */}
        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-lg">
              {homeTeam ? getTeamName(homeTeam) : 'Unknown Team'} vs {awayTeam ? getTeamName(awayTeam) : 'Unknown Team'}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Game ID: {game?.id || 'Unknown'}
            </div>
          </div>
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
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {t('captain.cancel')}
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isUpdating ? t('captain.updating') : t('captain.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
