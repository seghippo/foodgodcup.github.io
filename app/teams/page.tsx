'use client';

import { teams } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export default function TeamsPage() {
  const { t, getTeamName, getCoachName, getPlayerName, getPlayerPosition, getPlayerExperience } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('teams.title')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="card">
            {/* Team Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{getTeamName(team)}</h2>
              <span className="badge">{team.city}</span>
            </div>
            
            {/* Team Info */}
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                {t('teams.coach')}: {getCoachName(team)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t('teams.founded')}: {team.founded}
              </p>
            </div>

            {/* Roster Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-league-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('teams.roster')}
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {team.roster.map((player) => (
                  <div key={player.id} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="font-medium text-sm">{getPlayerName(player)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {player.id}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {getPlayerExperience(player)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
