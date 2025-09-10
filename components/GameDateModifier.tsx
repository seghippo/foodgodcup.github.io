'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { formatGameDate, getTodayISOString, isGameDateInFuture } from '@/lib/dateUtils';
import { type Game } from '@/lib/data';

interface GameDateModifierProps {
  game: Game;
  onDateUpdate: (gameId: string, newDate: string) => void;
}

export default function GameDateModifier({ game, onDateUpdate }: GameDateModifierProps) {
  const { t, getTeamName } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(game.date.split('T')[0]); // Extract date part only
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeTeam = { id: game.home };
  const awayTeam = { id: game.away };
  
  const isFutureGame = isGameDateInFuture(game.date);
  const todayDate = getTodayISOString().split('T')[0];

  const handleDateUpdate = async () => {
    setIsSubmitting(true);
    
    try {
      // Convert the date input to ISO string with time
      const newDateTime = new Date(newDate + 'T' + game.time.replace(' ', 'T'));
      onDateUpdate(game.id, newDateTime.toISOString());
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating game date:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewDate(game.date.split('T')[0]);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {t('captain.modifyGameDate')} - {getTeamName(homeTeam)} vs {getTeamName(awayTeam)}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {t('captain.modifyGameDate')}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {t('captain.cancel')}
            </button>
            <button
              onClick={handleDateUpdate}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? t('captain.submitting') : t('captain.saveChanges')}
            </button>
          </div>
        )}
      </div>

      {/* Current Date Display */}
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('captain.gameDate')}
            </label>
            {isEditing ? (
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                max={todayDate}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
              />
            ) : (
              <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg">
                {formatGameDate(game.date)}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('captain.currentDate')}
            </label>
            <div className="p-2 bg-slate-100 dark:bg-slate-600 rounded-lg">
              {formatGameDate(getTodayISOString())}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {isFutureGame && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                {t('captain.futureGameWarning')}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t('captain.scoresResetWarning')}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isFutureGame && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-green-600 dark:text-green-400 text-xl">✅</div>
            <div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {t('captain.dateModified')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Game Details */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <p><strong>{t('schedule.venue')}:</strong> {game.venue || t('schedule.tbd')}</p>
        <p><strong>{t('schedule.time')}:</strong> {game.time}</p>
        <p><strong>{t('schedule.status')}:</strong> {t(`schedule.${game.status}`)}</p>
      </div>
    </div>
  );
}
