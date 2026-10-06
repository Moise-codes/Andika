import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/** Only allow redirects to internal, absolute paths (prevents open redirects). */
function safeNext(next: string | null): string {
  if (!next) return '/dashboard';
  if (!next.startsWith('/') || next.startsWith('//')) return '/dashboard';
  return next;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeNext(url.searchParams.get('next'));
  const errorDescription =
    url.searchParams.get('error_description') ?? url.searchParams.get('error');

  if (errorDescription) {
    const loginUrl = new URL('/login', url.origin);
    loginUrl.searchParams.set('error', errorDescription);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Supabase OAuth error:', error.message);
        const loginUrl = new URL('/login', url.origin);
        loginUrl.searchParams.set(
          'error',
          `Sign-in failed: ${error.message}`,
        );
        return NextResponse.redirect(loginUrl);
      }

      console.log('OAuth successful, session created for user:', data.user?.id);

      // Sync the user profile with backend after successful OAuth
      if (data.session?.access_token) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          const syncRes = await fetch(`${backendUrl}/auth/sync`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Sync response status:', syncRes.status);
          if (!syncRes.ok) {
            console.error('Sync failed:', await syncRes.text());
          }
        } catch (syncError) {
          console.error('Failed to sync profile after OAuth:', syncError);
          // Don't block the redirect if sync fails
        }
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      const loginUrl = new URL('/login', url.origin);
      loginUrl.searchParams.set('error', 'Authentication is not configured correctly.');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
