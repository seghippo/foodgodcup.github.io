'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { teams, schedule, type Game, type Team } from '@/lib/data';

interface ScoreSubmissionProps {
  gameId: string;
  onScoreSubmit: (result: any) => void;
}

export default function ScoreSubmission({ gameId, onScoreSubmit }: ScoreSubmissionProps) {
  const { t, getTeamName } = useLanguage();
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [playerStats, setPlayerStats] = useState<{[key: string]: {wins: number, losses: number}}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the game
  const game = schedule.find(g => g.id === gameId);
  if (!game) return null;

  const homeTeam = teams.find(t => t.id === game.homeTeam);
  const awayTeam = teams.find(t => t.id === game.awayTeam);
  
  if (!homeTeam || !awayTeam) return null;

  const handlePlayerStatChange = (playerId: string, type: 'wins' | 'losses', value: number) => {
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [type]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const matchResult = {
      id: `MR${Date.now()}`,
      gameId: gameId,
      homeTeamId: game.homeTeam,
      awayTeamId: game.awayTeam,
      homeScore,
      awayScore,
      submittedBy: 'CAPTAIN_ID', // This would come from authentication
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
      players: {
        homeTeam: homeTeam.roster.map(player => ({
          playerId: player.id,
          wins: playerStats[player.id]?.wins || 0,
          losses: playerStats[player.id]?.losses || 0
        })),
        awayTeam: awayTeam.roster.map(player => ({
          playerId: player.id,
          wins: playerStats[player.id]?.wins || 0,
          losses: playerStats[player.id]?.losses || 0
        }))
      }
    };

    try {
      // Here you would send to your backend/API
      console.log('Submitting match result:', matchResult);
      onScoreSubmit(matchResult);
      
      // Reset form
      setHomeScore(0);
      setAwayScore(0);
      setPlayerStats({});
      
      alert('Score submitted successfully!');
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Error submitting score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">{t('schedule.submitScore')}</h3>
      
      {/* Game Info */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <h4 className="font-semibold">{getTeamName(homeTeam)}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">vs</p>
            <h4 className="font-semibold">{getTeamName(awayTeam)}</h4>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {new Date(game.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Score Input */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">{t('schedule.finalScore')}</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {getTeamName(homeTeam)}
            </label>
            <input
              type="number"
              min="0"
              value={homeScore}
              onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
            />
          </div>
          <div className="text-2xl font-bold">-</div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {getTeamName(awayTeam)}
            </label>
            <input
              type="number"
              min="0"
              value={awayScore}
              onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">{t('schedule.playerStats')}</h4>
        
        {/* Home Team Players */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">{getTeamName(homeTeam)}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {homeTeam.roster.map(player => (
              <div key={player.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm font-medium w-20">{player.id}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">W:</span>
                  <input
                    type="number"
                    min="0"
                    value={playerStats[player.id]?.wins || 0}
                    onChange={(e) => handlePlayerStatChange(player.id, 'wins', parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">L:</span>
                  <input
                    type="number"
                    min="0"
                    value={playerStats[player.id]?.losses || 0}
                    onChange={(e) => handlePlayerStatChange(player.id, 'losses', parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Away Team Players */}
        <div className="mb-4">
          <h5 className="font-medium mb-2">{getTeamName(awayTeam)}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {awayTeam.roster.map(player => (
              <div key={player.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                <span className="text-sm font-medium w-20">{player.id}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">W:</span>
                  <input
                    type="number"
                    min="0"
                    value={playerStats[player.id]?.wins || 0}
                    onChange={(e) => handlePlayerStatChange(player.id, 'wins', parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">L:</span>
                  <input
                    type="number"
                    min="0"
                    value={playerStats[player.id]?.losses || 0}
                    onChange={(e) => handlePlayerStatChange(player.id, 'losses', parseInt(e.target.value) || 0)}
                    className="w-12 px-1 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-league-primary hover:bg-league-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('schedule.submitting') : t('schedule.submitScore')}
      </button>
    </div>
  );
}
