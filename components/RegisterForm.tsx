'use client';

import { useState } from 'react';
import { useAuth, type RegisterData } from '@/lib/auth';
import { useLanguage } from '@/lib/language';
import { teams } from '@/lib/data';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const { t, getTeamName } = useLanguage();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    teamId: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    if (!formData.teamId) {
      setError(t('auth.selectTeam'));
      return;
    }

    const result = await register(formData);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || t('auth.registrationError'));
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">{t('auth.register')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t('auth.fullName')}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
              placeholder={t('auth.namePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
              placeholder={t('auth.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="team" className="block text-sm font-medium mb-1">
              {t('auth.team')}
            </label>
            <select
              id="team"
              value={formData.teamId}
              onChange={(e) => handleInputChange('teamId', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
            >
              <option value="">{t('auth.selectTeam')}</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {getTeamName(team)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              {t('auth.password')}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
              placeholder={t('auth.passwordPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
              placeholder={t('auth.confirmPasswordPlaceholder')}
            />
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-league-primary hover:bg-league-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('auth.registering') : t('auth.register')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('auth.haveAccount')}{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-league-primary hover:text-league-primary-dark font-medium"
            >
              {t('auth.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
