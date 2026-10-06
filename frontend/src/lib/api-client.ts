'use client';

import { createClient, isSupabaseConfigured } from './supabase/client';

const API_PREFIX = '/api/v1';

/** Backend origin, e.g. http://localhost:3001 (no trailing slash, no /api/v1). */
export function getApiOrigin(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return base.replace(/\/+$/, '').replace(/\/api\/v1$/, '');
}

/** Full backend API base, e.g. http://localhost:3001/api/v1 */
export function getApiBaseUrl(): string {
  return `${getApiOrigin()}${API_PREFIX}`;
}

/** Current Supabase access token, used as the backend bearer token. */
export async function getAuthToken(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await createClient().auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = path.startsWith('http') ? path : `${getApiBaseUrl()}${path}`;

  return fetch(url, {
    ...options,
    headers,
  });
}

export function apiGet(path: string): Promise<Response> {
  return apiFetch(path, { method: 'GET' });
}

export function apiPost(path: string, data?: unknown): Promise<Response> {
  return apiFetch(path, {
    method: 'POST',
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}

export function apiPatch(path: string, data?: unknown): Promise<Response> {
  return apiFetch(path, {
    method: 'PATCH',
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}

export function apiDelete(path: string): Promise<Response> {
  return apiFetch(path, { method: 'DELETE' });
}
