'use client';

import { useLanguage } from '@/lib/language';

export default function AboutPage() {
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
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-league-gold to-yellow-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-league-primary dark:text-white">{t('about.title')}</h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Charter Content */}
      <div className="space-y-6">
        {/* Chapter 1: Purpose and Significance */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter1.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter1.purpose.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter1.purpose.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter1.significance.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter1.significance.content')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 2: Organizational Framework */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter2.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter2.organizer.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter2.organizer.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter2.host.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter2.host.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter2.teams.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{t('about.chapter2.teams.content')}</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-600 dark:text-slate-300 font-mono text-sm leading-relaxed">{t('about.chapter2.teams.list')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 3: Tennis Competition */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter3.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter3.content')}</p>
          </div>
        </div>

        {/* Chapter 4: Comprehensive Activities */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter4.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter4.culinary.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter4.culinary.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter4.celebration.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter4.celebration.content')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 5: Member Affiliation and Participation */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter5.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter5.affiliation.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter5.affiliation.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter5.participation.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter5.participation.content')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 6: Awards */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter6.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter6.main.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter6.main.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter6.round.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter6.round.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter6.individual.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter6.individual.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter6.trophy.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter6.trophy.content')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 7: Supplementary Provisions */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-league-primary dark:text-white mb-4">{t('about.chapter7.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter7.interpretation.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter7.interpretation.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter7.adjustment.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter7.adjustment.content')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.chapter7.implementation.title')}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.chapter7.implementation.content')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
