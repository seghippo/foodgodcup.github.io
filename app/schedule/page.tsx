'use client';

import { schedule, teamsById, refreshScheduleFromStorage } from '@/lib/data';
import { useLanguage } from '@/lib/language';
import { useState, useEffect } from 'react';

export default function SchedulePage() {
  const { t, getTeamName, isClient } = useLanguage();
  const [currentSchedule, setCurrentSchedule] = useState(schedule);
  
  // Function to format date string without timezone issues
  const formatDateString = (dateString: string) => {
    // Parse the date string as local date to avoid timezone conversion
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString();
  };
  
  // Refresh schedule from localStorage when component mounts
  useEffect(() => {
    if (isClient) {
      const refreshedSchedule = refreshScheduleFromStorage();
      setCurrentSchedule(refreshedSchedule);
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
  
  const getStatusBadge = (status: string, isPreseason?: boolean) => {
    if (isPreseason) {
      return <span className="badge-warning">{t('schedule.preseason')}</span>;
    }
    switch (status) {
      case 'completed':
        return <span className="badge-success">{t('schedule.completed')}</span>;
      case 'scheduled':
        return <span className="badge">{t('schedule.scheduled')}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getScoreDisplay = (game: any) => {
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
    return <span className="text-slate-400">-</span>;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('schedule.title')}</h1>
      <div className="card overflow-x-auto">
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
            {currentSchedule.map((g) => (
              <tr key={g.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="py-3 pr-4">{formatDateString(g.date)}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getTeamName(teamsById[g.home])}</span>
                    <span className="text-slate-400">vs</span>
                    <span className="font-medium">{getTeamName(teamsById[g.away])}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">{getScoreDisplay(g)}</td>
                <td className="py-3 pr-4">{g.venue}</td>
                <td className="py-3 pr-4">{g.time}</td>
                <td className="py-3 pr-4">{getStatusBadge(g.status, g.isPreseason)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
