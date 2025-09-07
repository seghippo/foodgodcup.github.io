'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';

interface BlogPostClientProps {
  post: any;
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const { t, getPostTitle, getPostContent } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/blog" 
        className="inline-flex items-center gap-2 text-league-accent hover:text-league-highlight transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('nav.blog')}
      </Link>
      
      <article className="card">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-league-primary dark:text-white mb-4 leading-tight">
            {getPostTitle(post)}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="badge-success">{t('common.new')}</span>
          </div>
        </header>
        
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
            {getPostContent(post)}
          </div>
        </div>
      </article>
    </div>
  );
}
