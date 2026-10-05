import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AuthLayout } from '../components/auth/AuthLayout';
import { api } from '../services/api';
import type { User as UserType } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (user: UserType, token: string) => void;
  onNavigateLogin: () => void;
  onNavigateLanding: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
  onNavigateLanding
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.register(name.trim(), email.trim(), password);
      onRegisterSuccess(data.user, data.token || '');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout variant="register" onNavigateLanding={onNavigateLanding}>
      <div className="text-center mb-8">
        <h1 className="text-[26px] sm:text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Start managing clients, winning proposals, and getting paid on time.
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
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 transition-all"
            />
          </div>
        </div>

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
              placeholder="alex@example.com"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 transition-all"
            />
          </div>
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="w-full font-semibold shadow-sm"
          >
            {isLoading ? (
              <span>Creating account...</span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Value props */}
      <div className="mt-6 pt-5 border-t border-gray-200 space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span>Full access to AI Proposal Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span>Start with a clean, professional workspace</span>
        </div>
      </div>

      <p className="text-xs text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <button
          onClick={onNavigateLogin}
          className="font-bold text-gray-900 hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </AuthLayout>
  );
};