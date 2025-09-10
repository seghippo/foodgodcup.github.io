'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { teams, schedule, matchResults, removeGameFromSchedule, updateGameInfo, refreshScheduleFromStorage } from '@/lib/data';
import DetailedScoreSubmission from '@/components/DetailedScoreSubmission';
import ScoreModification from '@/components/ScoreModification';
import CreateGameForm from '@/components/CreateGameForm';
import EditGameForm from '@/components/EditGameForm';

export default function CaptainPage() {
  const { t, getTeamName } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  
  // Function to format date string without timezone issues
  const formatDateString = (dateString: string) => {
    try {
      // Handle both ISO strings and simple date strings
      let date: Date;
      
      if (dateString.includes('T')) {
        // ISO string format: "2024-01-15T00:00:00.000Z"
        date = new Date(dateString);
      } else {
        // Simple date format: "2024-01-15"
        const [year, month, day] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day); // month is 0-indexed
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [submittedResults, setSubmittedResults] = useState(matchResults);
  const [currentSchedule, setCurrentSchedule] = useState(schedule);
  const [scheduleKey, setScheduleKey] = useState(0); // Key to force re-render when schedule changes
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<string | null>(null);

  // Refresh schedule from localStorage when component mounts
  useEffect(() => {
    const refreshedSchedule = refreshScheduleFromStorage();
    setCurrentSchedule(refreshedSchedule);
  }, []);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // This will show a browser confirmation dialog
      e.preventDefault();
      e.returnValue = '';
    };

    // Add event listener when component mounts
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
  const availableGames = currentSchedule.filter(game => 
    game.status === 'completed' || game.status === 'scheduled'
  );

  const handleScoreSubmit = (result: any) => {
    setSubmittedResults(prev => [...prev, result]);
    
    // Update game status to completed when results are submitted
    const gameIndex = currentSchedule.findIndex(game => game.id === result.gameId);
    if (gameIndex !== -1) {
      const updatedSchedule = [...currentSchedule];
      updatedSchedule[gameIndex] = { ...updatedSchedule[gameIndex], status: 'completed' };
      setCurrentSchedule(updatedSchedule);
      
      // Update the global schedule as well
      updateGameInfo(result.gameId, { status: 'completed' });
      setScheduleKey(prev => prev + 1);
    }
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

  const handleGameCreated = (newGame: any) => {
    // Refresh schedule from localStorage to get the latest data
    const refreshedSchedule = refreshScheduleFromStorage();
    setCurrentSchedule(refreshedSchedule);
    // Select the newly created game
    setSelectedGame(newGame.id);
    // Force re-render
    setScheduleKey(prev => prev + 1);
  };

  const handleDeleteGame = (gameId: string) => {
    setGameToDelete(gameId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteGame = () => {
    if (gameToDelete) {
      try {
        // Remove from schedule
        const success = removeGameFromSchedule(gameToDelete);
        if (success) {
          // Refresh schedule from localStorage to get the latest data
          const refreshedSchedule = refreshScheduleFromStorage();
          setCurrentSchedule(refreshedSchedule);
          
          // Clear selected game if it was the deleted one
          if (selectedGame === gameToDelete) {
            setSelectedGame('');
          }
          
          // Remove any submitted results for this game
          setSubmittedResults(prev => prev.filter(result => result.gameId !== gameToDelete));
          
          // Force re-render
          setScheduleKey(prev => prev + 1);
          
          // Show success message
          alert(t('captain.gameDeleted'));
        } else {
          alert(t('captain.gameDeleteFailed'));
        }
      } catch (error) {
        console.error('Error deleting game:', error);
        alert(t('captain.gameDeleteFailed'));
      }
    }
    
    // Close dialog
    setShowDeleteDialog(false);
    setGameToDelete(null);
  };

  const cancelDeleteGame = () => {
    setShowDeleteDialog(false);
    setGameToDelete(null);
  };

  const handleEditGame = (gameId: string) => {
    setGameToEdit(gameId);
  };

  const handleGameUpdated = (updatedGame: any) => {
    try {
      // Update in schedule
      const success = updateGameInfo(updatedGame.id, updatedGame);
      if (success) {
        // Refresh schedule from localStorage to get the latest data
        const refreshedSchedule = refreshScheduleFromStorage();
        setCurrentSchedule(refreshedSchedule);
        
        // Clear edit mode
        setGameToEdit(null);
        
        // Force re-render
        setScheduleKey(prev => prev + 1);
        
        // Show success message
        alert(t('captain.gameUpdated'));
      } else {
        alert(t('captain.gameUpdateFailed'));
      }
    } catch (error) {
      console.error('Error updating game:', error);
      alert(t('captain.gameUpdateFailed'));
    }
  };

  const cancelEditGame = () => {
    setGameToEdit(null);
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
        
        {availableGames.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t('captain.noGamesScheduled')}
            </p>
          </div>
        ) : (
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
                        {formatDateString(game.date)}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGame(game.id);
                        }}
                        className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded transition-colors"
                        title={t('captain.editGame')}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGame(game.id);
                        }}
                        className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded transition-colors"
                        title={t('captain.deleteGame')}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Create Game Button - Always Available */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <CreateGameForm 
            userTeamId={user.teamId} 
            onGameCreated={handleGameCreated}
          />
        </div>
      </div>

      {/* Edit Game Form */}
      {gameToEdit && (
        <EditGameForm
          game={currentSchedule.find(game => game.id === gameToEdit)!}
          onGameUpdated={handleGameUpdated}
          onCancel={cancelEditGame}
        />
      )}

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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">{t('captain.deleteGame')}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t('captain.confirmDeleteGame')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteGame}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {t('captain.cancel')}
              </button>
              <button
                onClick={confirmDeleteGame}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {t('captain.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
