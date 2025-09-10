'use client';

import { useLanguage } from '@/lib/language';

export default function RulesPage() {
  const { t, isClient } = useLanguage();
  
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-league-primary dark:text-white mb-4">
          {t('rules.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('rules.description')}
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Culinary Competition Rules */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-league-gold to-yellow-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-league-primary dark:text-white">
              {t('rules.culinary.title')}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-league-gold/10 to-yellow-500/10 rounded-xl border border-league-gold/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.culinary.scoring.title')}
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-league-gold rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                  {t('rules.culinary.scoring.first')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-league-silver rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                  {t('rules.culinary.scoring.second')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-league-bronze rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                  {t('rules.culinary.scoring.third')}
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-league-accent/10 to-league-highlight/10 rounded-xl border border-league-accent/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.culinary.rounds.title')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {t('rules.culinary.rounds.description')}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-league-success/10 to-emerald-500/10 rounded-xl border border-league-success/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.culinary.evaluation.title')}
              </h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• {t('rules.culinary.evaluation.taste')}</li>
                <li>• {t('rules.culinary.evaluation.presentation')}</li>
                <li>• {t('rules.culinary.evaluation.creativity')}</li>
                <li>• {t('rules.culinary.evaluation.authenticity')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tennis Competition Rules */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-league-accent to-league-highlight rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-league-primary dark:text-white">
              {t('rules.tennis.title')}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-league-accent/10 to-league-highlight/10 rounded-xl border border-league-accent/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.tennis.scoring.title')}
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-league-success rounded-full flex items-center justify-center text-white text-sm font-bold">W</span>
                  {t('rules.tennis.scoring.win')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-league-warning rounded-full flex items-center justify-center text-white text-sm font-bold">D</span>
                  {t('rules.tennis.scoring.draw')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-league-danger rounded-full flex items-center justify-center text-white text-sm font-bold">L</span>
                  {t('rules.tennis.scoring.loss')}
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-league-info/10 to-blue-500/10 rounded-xl border border-league-info/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.tennis.format.title')}
              </h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• {t('rules.tennis.format.doubles')}</li>
                <li>• {t('rules.tennis.format.mixed')}</li>
                <li>• {t('rules.tennis.format.singles')}</li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-league-gold/10 to-yellow-500/10 rounded-xl border border-league-gold/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.tennis.rules.title')}
              </h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• {t('rules.tennis.rules.itf')}</li>
                <li>• {t('rules.tennis.rules.pro8')}</li>
                <li>• {t('rules.tennis.rules.flexible')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* General Rules */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-league-primary to-league-secondary rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-league-primary dark:text-white">
            {t('rules.general.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-league-success/10 to-emerald-500/10 rounded-xl border border-league-success/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.general.participation.title')}
              </h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• {t('rules.general.participation.attendance')}</li>
                <li>• {t('rules.general.participation.minimum')}</li>
                <li>• {t('rules.general.participation.respect')}</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-league-warning/10 to-orange-500/10 rounded-xl border border-league-warning/20">
              <h3 className="font-semibold text-league-primary dark:text-white mb-2">
                {t('rules.general.penalties.title')}
              </h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                <li>• {t('rules.general.penalties.noShow')}</li>
                <li>• {t('rules.general.penalties.noParticipation')}</li>
                <li>• {t('rules.general.penalties.unsportsmanlike')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
