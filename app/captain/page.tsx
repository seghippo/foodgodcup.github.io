'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { teams, schedule, matchResults } from '@/lib/data';
import DetailedScoreSubmission from '@/components/DetailedScoreSubmission';
import ScoreModification from '@/components/ScoreModification';

export default function CaptainPage() {
  const { t, getTeamName } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [submittedResults, setSubmittedResults] = useState(matchResults);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-league-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">{t('auth.loggingIn')}</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Filter games that are completed or can have scores submitted
  const availableGames = schedule.filter(game => 
    game.status === 'completed' || game.status === 'scheduled'
  );

  const handleScoreSubmit = (result: any) => {
    setSubmittedResults(prev => [...prev, result]);
  };

  const handleScoreUpdate = (updatedResult: any) => {
    setSubmittedResults(prev => 
      prev.map(result => 
        result.id === updatedResult.id ? updatedResult : result
      )
    );
  };

  const handleDateUpdate = (gameId: string, newDate: string) => {
    // In a real application, this would update the game date in the database
    // For now, we'll just show a success message
    console.log(`Game ${gameId} date updated to ${newDate}`);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t('captain.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('captain.subtitle')}
        </p>
      </div>

      {/* User Profile */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-league-accent to-league-highlight rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {getTeamName(teams.find(t => t.id === user.teamId)!)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/auth');
            }}
            className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>

      {/* Game Selection */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">{t('captain.selectGame')}</h2>
        <div className="grid gap-3">
          {availableGames.map(game => {
            const homeTeam = teams.find(t => t.id === game.home);
            const awayTeam = teams.find(t => t.id === game.away);
            
            if (!homeTeam || !awayTeam) return null;

            return (
              <div
                key={game.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedGame === game.id
                    ? 'border-league-primary bg-league-primary/5'
                    : 'border-slate-200 dark:border-slate-700 hover:border-league-primary/50'
                }`}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-semibold">{getTeamName(homeTeam)}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">vs</div>
                      <div className="font-semibold">{getTeamName(awayTeam)}</div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(game.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      game.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {t(`schedule.${game.status}`)}
                    </span>
                    {selectedGame === game.id && (
                      <span className="text-league-primary">✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Submission Form */}
      {selectedGame && (
        <>
          {/* Check if there's an existing result for this game */}
          {submittedResults.find(result => result.gameId === selectedGame) ? (
            <ScoreModification 
              gameId={selectedGame} 
              onScoreUpdate={handleScoreUpdate}
              onDateUpdate={handleDateUpdate}
            />
          ) : (
            <DetailedScoreSubmission 
              gameId={selectedGame} 
              onScoreSubmit={handleScoreSubmit}
              onDateUpdate={handleDateUpdate}
            />
          )}
        </>
      )}

      {/* Submitted Results */}
      {submittedResults.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{t('captain.submittedResults')}</h2>
          <div className="space-y-3">
            {submittedResults.map(result => {
              const homeTeam = teams.find(t => t.id === result.homeTeamId);
              const awayTeam = teams.find(t => t.id === result.awayTeamId);
              
              if (!homeTeam || !awayTeam) return null;

              return (
                <div key={result.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">
                      {getTeamName(homeTeam)} {result.homeTotalScore} - {result.awayTotalScore} {getTeamName(awayTeam)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.status === 'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : result.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {result.status}
                      </span>
                      <button
                        onClick={() => setSelectedGame(result.gameId)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        {t('captain.modifyResult')}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Submitted: {new Date(result.submittedAt).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
