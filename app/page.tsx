'use client';

import Link from 'next/link';
import { posts, latestPost, schedule, teams } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export default function HomePage() {
  const latest = latestPost();
  const { t, getPostTitle, getPostExcerpt, language, setLanguage, isClient } = useLanguage();
  
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
  
  // Count completed official matches (excluding preseason)
  const completedMatches = schedule.filter(game => game.status === 'completed' && !game.isPreseason).length;
  
  // Calculate total players from all team rosters
  const totalPlayers = teams.reduce((total, team) => total + team.roster.length, 0);
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white/90 text-sm font-medium">{t('home.welcome')}</span>
            </div>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm ${
                  language === 'en' 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm ${
                  language === 'zh' 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                中文
              </button>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
            <span className="bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent">
              {t('home.title')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl leading-relaxed">
            {t('home.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/schedule" className="btn-gold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('home.viewSchedule')}
            </Link>
            <Link href="/standings" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('home.viewStandings')}
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg"></div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="stat-card text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-league-accent to-league-highlight rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-league-primary dark:text-white">7</div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('home.activeTeams')}</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-league-success to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-league-primary dark:text-white">{completedMatches}</div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('home.gamesPlayed')}</div>
        </div>
        
        <div className="stat-card text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-league-info to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-league-primary dark:text-white">{totalPlayers}</div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('home.players')}</div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-league-gold to-yellow-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-league-primary dark:text-white">{t('about.title')}</h2>
        </div>
        
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-league-primary dark:text-white mb-2">{t('about.subtitle')}</h3>
          </div>
          
          {/* Chapter 1: Purpose and Significance */}
          <div className="p-4 bg-gradient-to-r from-league-accent/10 to-league-highlight/10 rounded-xl border border-league-accent/20">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter1.title')}</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter1.purpose.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter1.purpose.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter1.significance.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter1.significance.content')}</p>
              </div>
            </div>
          </div>

          {/* Chapter 2: Organizational Framework */}
          <div className="p-4 bg-gradient-to-r from-league-success/10 to-emerald-500/10 rounded-xl border border-league-success/20">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter2.title')}</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter2.organizer.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter2.organizer.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter2.host.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter2.host.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter2.teams.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{t('about.chapter2.teams.content')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter2.teams.list')}</p>
              </div>
            </div>
          </div>

          {/* Chapter 3: Tennis Competition */}
          <div className="p-4 bg-gradient-to-r from-league-info/10 to-blue-500/10 rounded-xl border border-league-info/20">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter3.title')}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter3.content')}</p>
          </div>

          {/* Chapter 4: Comprehensive Activities */}
          <div className="p-4 bg-gradient-to-r from-league-warning/10 to-orange-500/10 rounded-xl border border-league-warning/20">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter4.title')}</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter4.culinary.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter4.culinary.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter4.celebration.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter4.celebration.content')}</p>
              </div>
            </div>
          </div>

          {/* Chapter 5: Member Affiliation and Participation */}
          <div className="p-4 bg-gradient-to-r from-league-primary/10 to-league-secondary/10 rounded-xl border border-league-primary/20">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter5.title')}</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter5.affiliation.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter5.affiliation.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter5.participation.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter5.participation.content')}</p>
              </div>
            </div>
          </div>

          {/* Chapter 6: Awards */}
          <div className="p-4 bg-gradient-to-r from-league-gold/10 to-yellow-500/10 rounded-xl border border-league-gold/20">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter6.title')}</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter6.main.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter6.main.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter6.round.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter6.round.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter6.individual.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter6.individual.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter6.trophy.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter6.trophy.content')}</p>
              </div>
            </div>
          </div>

          {/* Chapter 7: Supplementary Provisions */}
          <div className="p-4 bg-gradient-to-r from-slate-100/50 to-slate-200/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-league-primary dark:text-white mb-3">{t('about.chapter7.title')}</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter7.interpretation.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter7.interpretation.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter7.adjustment.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter7.adjustment.content')}</p>
              </div>
              <div>
                <h5 className="font-medium text-league-primary dark:text-white mb-1">{t('about.chapter7.implementation.title')}</h5>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.chapter7.implementation.content')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Latest Blog Post */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-league-accent to-league-highlight rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-league-primary dark:text-white">{t('home.latestNews')}</h2>
            </div>
            
            {latest ? (
              <article className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="badge-success">{t('common.new')}</span>
                  <span>{new Date(latest.date).toLocaleDateString()}</span>
                </div>
                       <Link href={`/blog/${latest.slug}`} className="block group">
                         <h3 className="text-2xl font-bold text-league-primary dark:text-white group-hover:text-league-accent transition-colors mb-3">
                           {getPostTitle(latest)}
                         </h3>
                         <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                           {getPostExcerpt(latest)}
                         </p>
                       </Link>
                <Link href={`/blog/${latest.slug}`} className="btn">
                  {t('home.readFullArticle')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400">No posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links & Announcements */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="card">
            <h3 className="text-xl font-bold text-league-primary dark:text-white mb-4">{t('home.quickAccess')}</h3>
            <div className="space-y-3">
              <Link href="/teams" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-league-accent to-league-highlight rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="font-medium group-hover:text-league-accent transition-colors">{t('nav.teams')}</span>
              </Link>
              
              <Link href="/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-league-success to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium group-hover:text-league-accent transition-colors">{t('nav.schedule')}</span>
              </Link>
              
              <Link href="/standings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-league-gold to-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-medium group-hover:text-league-accent transition-colors">{t('nav.standings')}</span>
              </Link>
              
              <Link href="/rules" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-league-primary to-league-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium group-hover:text-league-accent transition-colors">{t('nav.rules')}</span>
              </Link>
              
              <Link href="/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-league-info to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <span className="font-medium group-hover:text-league-accent transition-colors">{t('nav.blog')}</span>
              </Link>
            </div>
          </div>

          {/* Announcements */}
          <div className="card">
            <h3 className="text-xl font-bold text-league-primary dark:text-white mb-4">{t('home.importantUpdates')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-league-warning/10 to-orange-500/10 rounded-xl border border-league-warning/20">
                <div className="w-6 h-6 bg-league-warning rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('home.registrationDeadline')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('home.registrationDeadlineDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-league-success/10 to-emerald-500/10 rounded-xl border border-league-success/20">
                <div className="w-6 h-6 bg-league-success rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('home.openingDay')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('home.openingDayDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-league-info/10 to-blue-500/10 rounded-xl border border-league-info/20">
                <div className="w-6 h-6 bg-league-info rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('home.refereeClinic')}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t('home.refereeClinicDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
