'use client';

import Link from 'next/link';
import { posts } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export default function BlogIndex() {
  const { t, getPostTitle, getPostExcerpt, isClient } = useLanguage();
  
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('blog.title')}</h1>
      <ul className="grid sm:grid-cols-2 gap-5">
        {posts.map((p) => (
          <li key={p.slug} className="card">
            <h2 className="text-xl font-semibold">
              <Link href={`/blog/${p.slug}`} className="hover:text-league-accent transition-colors">
                {getPostTitle(p)}
              </Link>
            </h2>
            <p className="text-sm text-slate-500">{new Date(p.date).toLocaleDateString()}</p>
            <p className="mt-2 line-clamp-3 text-slate-600 dark:text-slate-300">{getPostExcerpt(p)}</p>
            <Link href={`/blog/${p.slug}`} className="btn mt-4">
              {t('blog.readMore')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
