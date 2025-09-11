'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href as any}
      onClick={() => setIsMobileMenuOpen(false)}
      className={clsx(
        'nav-link focus-ring',
        pathname === href && 'active'
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-league-primary/80 backdrop-blur-md shadow-lg">
      <div className="container max-w-7xl flex items-center justify-between py-4">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 bg-gradient-to-br from-league-accent to-league-highlight rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-league-primary via-league-accent to-league-highlight dark:from-white dark:via-yellow-100 dark:to-yellow-200 bg-clip-text text-transparent drop-shadow-sm">
              {t('home.title')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">{t('home.subtitle')}</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {link('/', t('nav.home'))}
          {link('/about', t('nav.about'))}
          {link('/teams', t('nav.teams'))}
          {link('/schedule', t('nav.schedule'))}
          {link('/standings', t('nav.standings'))}
          {link('/rules', t('nav.rules'))}
          {link('/blog', t('nav.blog'))}
          {/* Temporarily hidden: {link('/captain', t('nav.captain'))} */}
        </nav>


        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-league-primary/95 backdrop-blur-md">
          <nav className="container max-w-7xl py-4 space-y-2">
            {link('/', t('nav.home'))}
            {link('/teams', t('nav.teams'))}
            {link('/schedule', t('nav.schedule'))}
            {link('/standings', t('nav.standings'))}
            {link('/rules', t('nav.rules'))}
            {link('/blog', t('nav.blog'))}
            {/* Temporarily hidden: {link('/captain', t('nav.captain'))} */}
          </nav>
        </div>
      )}
    </header>
  );
}
