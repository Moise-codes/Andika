'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useToast } from '@/components/ui/Toast';
import { signUpWithEmail, signInWithGoogle } from '@/lib/supabase/auth';
import { apiGet, apiPost } from '@/lib/api-client';

const FAKE_DOMAINS = [
  'example.com',
  'test.com',
  'fake.com',
  'temp.com',
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? FAKE_DOMAINS.includes(domain) : false;
}

interface EmailStatus {
  exists: boolean;
  providers: string[];
}

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const lookupEmail = async (address: string): Promise<EmailStatus | null> => {
    try {
      const res = await apiGet(`/auth/email-status?email=${encodeURIComponent(address)}`);
      if (!res.ok) return null;
      return (await res.json()) as EmailStatus;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!name.trim() || !cleanEmail || !password) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    if (isDisposableEmail(cleanEmail)) {
      setErrorMessage('Temporary or fake email addresses are not allowed.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUpWithEmail({
        email: cleanEmail,
        password,
        fullName: name.trim(),
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          await guideExistingAccount(cleanEmail);
          return;
        }
        setErrorMessage(error.message);
        return;
      }

      // Supabase returns an obfuscated user (no identities) when the email is
      // already linked to an account — this prevents account enumeration.
      const identities = data.user?.identities?.length ?? 0;
      if (data.user && identities === 0) {
        await guideExistingAccount(cleanEmail);
        return;
      }

      // If email confirmation is disabled, a session is returned immediately.
      if (data.session) {
        showToast('Account created successfully!', 'success');
        // Sync profile with backend
        await apiPost('/auth/sync').catch(() => undefined);
        router.replace('/dashboard');
        router.refresh();
        return;
      }

      showToast('We sent a 6-digit code to your email.', 'success');
      router.push(`/verify-email?email=${encodeURIComponent(cleanEmail)}`);
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const guideExistingAccount = async (address: string) => {
    const status = await lookupEmail(address);
    const usesGoogle = status?.providers.includes('google') ?? false;
    const usesEmail = status?.providers.includes('email') ?? false;

    if (usesGoogle && !usesEmail) {
      setErrorMessage(
        `This email is registered with Google. Use "Continue with Google" to sign in.`,
      );
    } else if (usesGoogle && usesEmail) {
      setErrorMessage(
        'This email is already registered. Sign in with your password or continue with Google.',
      );
    } else {
      setErrorMessage(
        'This email is already registered. Sign in instead, or reset your password if you forgot it.',
      );
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle('/onboarding');
      if (error) {
        setErrorMessage(error.message);
        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage('Google sign-up is unavailable right now.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout variant="register">
      <div className="text-center mb-8">
        <h1 className="text-[26px] sm:text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Start improving your typing speed and accuracy today.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {errorMessage}{' '}
            <Link href="/login" className="font-bold underline">
              Go to sign in
            </Link>
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading || isLoading}
        className="w-full mb-4 font-semibold border border-gray-300 bg-white px-6 py-3 rounded-lg text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
        {isGoogleLoading ? 'Redirecting…' : 'Sign up with Google'}
      </button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">or continue with email</span>
        </div>
      </div>

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
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#415239] focus:ring-2 focus:ring-[#415239]/10 transition-all"
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#415239] focus:ring-2 focus:ring-[#415239]/10 transition-all"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-gray-50 text-sm text-gray-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:bg-white focus:outline-none focus:border-[#415239] focus:ring-2 focus:ring-[#415239]/10 transition-all"
            />
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full font-semibold shadow-sm btn-andika-primary px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span>Creating account…</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-200 space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span>Full access to all typing modes</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span>Track your progress with detailed analytics</span>
        </div>
      </div>

      <p className="text-xs text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-gray-900 hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4" />
      <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45c-.89.6-2.03.95-3.46.95-2.66 0-4.92-1.74-5.73-4.11H.96v2.52C2.6 17.76 6.02 20 10 20z" fill="#34A853" />
      <path d="M4.27 14.97c-.2-.6-.32-1.24-.32-1.97s.12-1.37.32-1.97V8.31H.96C.35 9.53 0 10.73 0 12s.35 2.47.96 3.69l3.31-2.72z" fill="#FBBC05" />
      <path d="M10 3.95c1.52 0 2.87.52 3.94 1.54l2.8-2.8C14.96.89 12.7 0 10 0 6.02 0 2.6 2.23.96 5.38l3.31 2.72c.81-2.37 3.07-4.11 5.73-4.11z" fill="#EA4335" />
    </svg>
  );
}
