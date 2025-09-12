'use client';

import { standings, teamsById, generatePlayerStandings } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export default function StandingsPage() {
  const { t, getTeamName } = useLanguage();

  // Generate individual player standings
  const playerStandings = generatePlayerStandings();
  
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">{t('standings.title')}</h1>
      

      {/* Tennis Standings */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-league-accent to-league-highlight rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-league-primary dark:text-white">{t('standings.tennisCompetition')}</h2>
        </div>
        
        <div className="card overflow-x-auto">
          
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                <th className="py-2 pr-4">{t('standings.player')}</th>
                <th className="py-2 pr-4">{t('standings.team')}</th>
                <th className="py-2 pr-4">{t('standings.wins')}</th>
                <th className="py-2 pr-4">{t('standings.losses')}</th>
                <th className="py-2 pr-4">{t('standings.points')}</th>
                <th className="py-2 pr-4">{t('standings.gamesPlayed')}</th>
                <th className="py-2 pr-4">{t('standings.percentage')}</th>
              </tr>
            </thead>
            <tbody>
              {playerStandings.map((s, index) => {
                const winPercentage = s.gamesPlayed > 0 ? (s.wins / s.gamesPlayed).toFixed(3) : '0.000';
                
                return (
                  <tr key={s.playerId} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? 'bg-gradient-to-r from-league-gold to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-league-silver to-gray-400' :
                            'bg-gradient-to-r from-league-bronze to-orange-600'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                        {s.playerName}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400">
                      {s.teamName}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-league-success/20 text-league-success">
                        {s.wins}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-league-danger/20 text-league-danger">
                        {s.losses}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-league-accent">{s.points}</td>
                    <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400">
                      {s.gamesPlayed}
                    </td>
                    <td className="py-3 pr-4">{winPercentage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
