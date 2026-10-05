'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Unable to sign in. Please try again.');
      }

      const data = await res.json();

      // Store tokens in cookies for middleware
      document.cookie = `access_token=${data.accessToken}; path=/; max-age=3600; SameSite=Lax`;
      document.cookie = `refresh_token=${data.refreshToken}; path=/; max-age=604800; SameSite=Lax`;

      // Also store in localStorage for API calls
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      showToast('Signed in successfully!', 'success');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // Initialize Google Identity Services
      if (!window.google) {
        throw new Error('Google Identity Services not loaded');
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        scope: 'email profile',
        callback: async (response: any) => {
          if (response.error) {
            throw new Error(response.error);
          }

          // Send ID token to backend
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.access_token }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Google authentication failed');
          }

          const data = await res.json();

          // Store tokens in cookies for middleware
          document.cookie = `access_token=${data.accessToken}; path=/; max-age=3600; SameSite=Lax`;
          document.cookie = `refresh_token=${data.refreshToken}; path=/; max-age=604800; SameSite=Lax`;

          // Also store in localStorage for API calls
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);

          showToast('Signed in with Google successfully!', 'success');

          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
      showToast('Google sign-in failed', 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout variant="login">
      <div className="text-center mb-8">
        <h1 className="text-[26px] sm:text-3xl font-bold tracking-tight text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Sign in to track your typing progress and compete.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google Sign-in Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="w-full mb-4 font-semibold border border-gray-300 bg-white px-6 py-3 rounded-lg text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
          <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45c-.89.6-2.03.95-3.46.95-2.66 0-4.92-1.74-5.73-4.11H.96v2.52C2.6 17.76 6.02 20 10 20z" fill="#34A853"/>
          <path d="M4.27 14.97c-.2-.6-.32-1.24-.32-1.97s.12-1.37.32-1.97V8.31H.96C.35 9.53 0 10.73 0 12s.35 2.47.96 3.69l3.31-2.72z" fill="#FBBC05"/>
          <path d="M10 3.95c1.52 0 2.87.52 3.94 1.54l2.8-2.8C14.96.89 12.7 0 10 0 6.02 0 2.6 2.23.96 5.38l3.31 2.72c.81-2.37 3.07-4.11 5.73-4.11z" fill="#EA4335"/>
        </svg>
        {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">or continue with email</span>
        </div>
      </div>

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
              placeholder="name@example.com"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#415239] focus:ring-2 focus:ring-[#415239]/10 transition-all"
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
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#415239] focus:ring-2 focus:ring-[#415239]/10 transition-all"
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 font-semibold shadow-sm btn-andika-primary px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Sign-up link */}
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-gray-900 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
