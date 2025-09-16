'use client';

import { schedule, teamsById, refreshScheduleFromStorage, refreshMatchResultsFromStorage, syncFromCloud } from '@/lib/data';
import { useLanguage } from '@/lib/language';
import { useState, useEffect } from 'react';

export default function SchedulePage() {
  const { t, getTeamName, isClient } = useLanguage();
  const [currentSchedule, setCurrentSchedule] = useState(schedule);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  
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
  
  // Refresh schedule and match results from localStorage when component mounts
  useEffect(() => {
    if (isClient) {
      // First load data from localStorage
      const refreshedSchedule = refreshScheduleFromStorage();
      console.log('Schedule data loaded:', refreshedSchedule);
      setCurrentSchedule(refreshedSchedule);
      
      const refreshedResults = refreshMatchResultsFromStorage();
      setMatchResults(refreshedResults);

      // Then auto-sync from GitHub in background
      const autoSync = async () => {
        try {
          const success = await syncFromCloud();
          if (success) {
            console.log('Schedule page: Data synced from GitHub');
            // Update data after sync
            const newSchedule = refreshScheduleFromStorage();
            setCurrentSchedule(newSchedule);
            
            const newResults = refreshMatchResultsFromStorage();
            setMatchResults(newResults);
          }
        } catch (error) {
          console.error('Schedule page: Failed to sync from GitHub', error);
        }
      };

      // Run sync in background without blocking UI
      autoSync();
    }
  }, [isClient]);
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-league-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = (status?: string, isPreseason?: boolean) => {
    if (isPreseason) {
      return <span className="badge-warning">{t('schedule.preseason')}</span>;
    }
    switch (status) {
      case 'completed':
        return <span className="badge-success">{t('schedule.completed')}</span>;
      case 'scheduled':
        return <span className="badge">{t('schedule.scheduled')}</span>;
      default:
        return <span className="badge">{status || 'scheduled'}</span>;
    }
  };

  const getScoreDisplay = (game: any) => {
    // First check if game has legacy scores (for preseason games)
    if (game.homeScore !== undefined && game.awayScore !== undefined) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-league-primary dark:text-white">
            {game.homeScore} - {game.awayScore}
          </span>
          {game.homeScore > game.awayScore ? (
            <span className="text-xs text-league-success">🏆 {getTeamName(teamsById[game.home])}</span>
          ) : game.awayScore > game.homeScore ? (
            <span className="text-xs text-league-success">🏆 {getTeamName(teamsById[game.away])}</span>
          ) : (
            <span className="text-xs text-league-info">Draw</span>
          )}
        </div>
      );
    }
    
    // Check for match results
    const matchResult = matchResults.find(result => 
      result.gameId === game.id && result.status === 'approved'
    );
    
    if (matchResult) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-league-primary dark:text-white">
            {matchResult.homeTotalScore} - {matchResult.awayTotalScore}
          </span>
          {matchResult.homeTotalScore > matchResult.awayTotalScore ? (
            <span className="text-xs text-league-success">🏆 {getTeamName(teamsById[game.home])}</span>
          ) : matchResult.awayTotalScore > matchResult.homeTotalScore ? (
            <span className="text-xs text-league-success">🏆 {getTeamName(teamsById[game.away])}</span>
          ) : (
            <span className="text-xs text-league-info">Draw</span>
          )}
        </div>
      );
    }
    
    return <span className="text-slate-400">-</span>;
  };
  
  const validGames = currentSchedule.filter(g => 
    g && 
    g.date && 
    g.home && 
    g.away && 
    g.id
  );
  
  // Debug logging
  console.log('Total games:', currentSchedule.length);
  console.log('Valid games:', validGames.length);
  console.log('Sample game:', validGames[0]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('schedule.title')}</h1>
      <div className="card overflow-x-auto">
        {validGames.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p>No games scheduled yet.</p>
            <p className="text-sm mt-2">Check back later or contact your captain to add games.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                <th className="py-2 pr-4">{t('schedule.date')}</th>
                <th className="py-2 pr-4">{t('schedule.match')}</th>
                <th className="py-2 pr-4">{t('schedule.score')}</th>
                <th className="py-2 pr-4">{t('schedule.venue')}</th>
                <th className="py-2 pr-4">{t('schedule.time')}</th>
                <th className="py-2 pr-4">{t('schedule.status')}</th>
              </tr>
            </thead>
            <tbody>
              {validGames.map((g) => (
                <tr key={g.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-3 pr-4">{formatDateString(g.date)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getTeamName(teamsById[g.home]) || g.home}</span>
                      <span className="text-slate-400">vs</span>
                      <span className="font-medium">{getTeamName(teamsById[g.away]) || g.away}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{getScoreDisplay(g)}</td>
                  <td className="py-3 pr-4">{g.venue || '-'}</td>
                  <td className="py-3 pr-4">{g.time || '-'}</td>
                  <td className="py-3 pr-4">{getStatusBadge(g.status, g.isPreseason)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
