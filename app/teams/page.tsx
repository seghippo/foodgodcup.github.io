'use client';

import { teams } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export default function TeamsPage() {
  const { t, getTeamName, getCoachName } = useLanguage();

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
          </div>
        ))}
      </div>
    </div>
  );
}
