'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MailCheck, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useToast } from '@/components/ui/Toast';
import { verifySignupOtp, resendSignupOtp, signInWithGoogle } from '@/lib/supabase/auth';
import { apiPost } from '@/lib/api-client';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const email = (searchParams.get('email') ?? '').trim().toLowerCase();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => digits.join(''), [digits]);
  const isComplete = code.length === CODE_LENGTH && digits.every(Boolean);

  useEffect(() => {
    if (!email) {
      router.replace('/signup');
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean.slice(-1);
      return next;
    });
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste support: distribute digits across the inputs.
      const chars = value.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((char, i) => {
          if (index + i < CODE_LENGTH) next[index + i] = char;
        });
        return next;
      });
      const focusIndex = Math.min(index + chars.length, CODE_LENGTH - 1);
      inputsRef.current[focusIndex]?.focus();
      return;
    }

    setDigit(index, value);
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);

    if (!isComplete) {
      setErrorMessage('Enter the 6-digit code from your email.');
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await verifySignupOtp(email, code);

      if (error) {
        setErrorMessage(
          error.message.toLowerCase().includes('expired')
            ? 'That code has expired. Request a new one below.'
            : 'That code is incorrect. Please check your email and try again.',
        );
        return;
      }

      await apiPost('/auth/sync').catch(() => undefined);
      showToast('Email verified! Welcome to ANDIKA.', 'success');
      router.replace('/onboarding');
      router.refresh();
    } catch {
      setErrorMessage('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setErrorMessage(null);
    try {
      const { error } = await resendSignupOtp(email);
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
      showToast('A new code is on its way.', 'success');
    } catch {
      setErrorMessage('Could not resend the code right now.');
    }
  };

  const handleGoogleInstead = async () => {
    await signInWithGoogle('/onboarding');
  };

  return (
    <AuthLayout variant="register">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#415239]/10 flex items-center justify-center">
          <MailCheck className="w-8 h-8 text-[#415239]" />
        </div>
        <h1 className="text-[26px] sm:text-3xl font-bold tracking-tight text-gray-900">
          Verify your email
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-gray-900">{email || 'your email'}</span>.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleVerify}>
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              aria-label={`Digit ${index + 1}`}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#415239] focus:ring-2 focus:ring-[#415239]/10 transition-all"
              style={{ height: '3.25rem' }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying || !isComplete}
          className="w-full font-semibold shadow-sm btn-andika-primary px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isVerifying ? (
            <span>Verifying…</span>
          ) : (
            <>
              <span>Verify email</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-xs font-semibold text-[#415239] hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>

        <div>
          <button
            type="button"
            onClick={handleGoogleInstead}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            Already verified? Continue with Google instead
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Wrong email?{' '}
          <Link href="/signup" className="font-semibold text-gray-900 hover:underline">
            Start over
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
