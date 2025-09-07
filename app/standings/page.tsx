'use client';

import { standings, culinaryStandings, teamsById } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export default function StandingsPage() {
  const { t, getTeamName } = useLanguage();
  
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
          <div className="mb-4 p-3 bg-gradient-to-r from-league-accent/10 to-league-highlight/10 rounded-xl border border-league-accent/20">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>{t('standings.tennisScoring')}</strong> {t('standings.tennisScoringDesc')}
            </p>
          </div>
          
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                <th className="py-2 pr-4">{t('standings.team')}</th>
                <th className="py-2 pr-4">{t('standings.wins')}</th>
                <th className="py-2 pr-4">{t('standings.losses')}</th>
                <th className="py-2 pr-4">{t('standings.draws')}</th>
                <th className="py-2 pr-4">{t('standings.points')}</th>
                <th className="py-2 pr-4">{t('standings.percentage')}</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, index) => {
                const totalGames = s.wins + s.losses + s.draws;
                
                return (
                  <tr key={s.teamId} className="border-t border-slate-200 dark:border-slate-800">
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
                        {getTeamName(teamsById[s.teamId])}
                      </div>
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
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-league-info/20 text-league-info">
                        {s.draws}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-league-accent">{s.points}</td>
                    <td className="py-3 pr-4">{(s.wins / totalGames).toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Culinary Competition Standings */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-league-gold to-yellow-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-league-primary dark:text-white">{t('standings.culinaryCompetition')}</h2>
        </div>
        
        <div className="card overflow-x-auto">
          <div className="mb-4 p-3 bg-gradient-to-r from-league-gold/10 to-yellow-500/10 rounded-xl border border-league-gold/20">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>{t('standings.scoringSystem')}</strong> {t('standings.scoringDesc')}
            </p>
          </div>
          
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                <th className="py-2 pr-4">{t('standings.team')}</th>
                <th className="py-2 pr-4">{t('standings.total')}</th>
                <th className="py-2 pr-4">{t('standings.round1')}</th>
                <th className="py-2 pr-4">{t('standings.round2')}</th>
                <th className="py-2 pr-4">{t('standings.round3')}</th>
              </tr>
            </thead>
            <tbody>
              {culinaryStandings.map((s, index) => (
                <tr key={s.teamId} className="border-t border-slate-200 dark:border-slate-800">
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
                      {getTeamName(teamsById[s.teamId])}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-bold text-league-gold">{s.points}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      s.round1 === 3 ? 'bg-league-gold/20 text-league-gold' :
                      s.round1 === 1 ? 'bg-league-accent/20 text-league-accent' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {s.round1}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      s.round2 === 3 ? 'bg-league-gold/20 text-league-gold' :
                      s.round2 === 1 ? 'bg-league-accent/20 text-league-accent' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {s.round2}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      s.round3 === 3 ? 'bg-league-gold/20 text-league-gold' :
                      s.round3 === 1 ? 'bg-league-accent/20 text-league-accent' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {s.round3}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
