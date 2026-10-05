import React, { useState } from 'react';
import {
  Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AuthLayout } from '../components/auth/AuthLayout';
import { api } from '../services/api';
import type { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
  onNavigateRegister: () => void;
  onNavigateLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateLanding
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.login(email.trim(), password);
      onLoginSuccess(data.user, data.token || '');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout variant="login" onNavigateLanding={onNavigateLanding}>
      <div className="text-center mb-8">
        <h1 className="text-[26px] sm:text-3xl font-bold tracking-tight text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Sign in to manage your clients, projects, and proposals.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@agency.com"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="lg"
          className="w-full mt-2 font-semibold shadow-sm"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

            {/* Sign-up link */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onNavigateRegister}
            className="font-bold text-gray-900 hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};