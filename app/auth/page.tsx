'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useLanguage } from '@/lib/language';

export default function AuthPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/captain');
    return null;
  }

  const handleAuthSuccess = () => {
    router.push('/captain');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-league-primary/10 via-white to-league-accent/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-league-accent to-league-highlight rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('auth.welcome')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {t('auth.subtitle')}
          </p>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}

        {/* Features */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {t('auth.features')}
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-league-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('auth.feature1')}
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-league-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('auth.feature2')}
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-league-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('auth.feature3')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
