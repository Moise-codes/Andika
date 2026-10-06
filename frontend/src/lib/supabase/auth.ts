'use client';

import type { AuthResponse } from '@supabase/supabase-js';
import { createClient } from './client';

function redirectUrl(path = '/dashboard'): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/auth/callback?next=${encodeURIComponent(path)}`;
}

/** Create an email/password account. Supabase emails a 6-digit OTP to confirm it. */
export function signUpWithEmail(params: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  return createClient().auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: { full_name: params.fullName },
      emailRedirectTo: redirectUrl('/onboarding'),
    },
  });
}

/** Confirm a signup with the 6-digit code from the verification email. */
export function verifySignupOtp(email: string, token: string): Promise<AuthResponse> {
  return createClient().auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
}

/** Re-send the signup OTP (subject to Supabase rate limits). */
export function resendSignupOtp(email: string): Promise<AuthResponse> {
  return createClient().auth.resend({ type: 'signup', email });
}

export function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  return createClient().auth.signInWithPassword({ email, password });
}

/**
 * Start the Google OAuth flow. Supabase automatically links the Google identity
 * to an existing account that uses the same verified email, and vice versa.
 */
export function signInWithGoogle(next = '/dashboard') {
  return createClient().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl(next),
      queryParams: { prompt: 'select_account' },
    },
  });
}

/** Send a password-recovery email that lands on the reset-password screen. */
export function sendPasswordReset(email: string) {
  return createClient().auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl('/reset-password'),
  });
}

/** Set a new password for the signed-in user (also used by Google-only accounts). */
export function updatePassword(password: string) {
  return createClient().auth.updateUser({ password });
}

export function signOut() {
  return createClient().auth.signOut();
}

export async function getAccessToken(): Promise<string | null> {
  const { data } = await createClient().auth.getSession();
  return data.session?.access_token ?? null;
}
