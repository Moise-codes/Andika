// API client with test mode support for MVP testing
// When test mode is enabled, it bypasses authentication requirements

const TEST_MODE_KEY = 'andika_test_mode';

export function isTestMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TEST_MODE_KEY) === 'true';
}

export function getAuthToken(): string | null {
  if (isTestMode()) {
    // Return a fake token for test mode
    return 'test-mode-token';
  }
  return localStorage.getItem('access_token');
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

// Convenience methods
export async function apiGet(url: string): Promise<Response> {
  return apiFetch(url, { method: 'GET' });
}

export async function apiPost(url: string, data: any): Promise<Response> {
  return apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPut(url: string, data: any): Promise<Response> {
  return apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDelete(url: string): Promise<Response> {
  return apiFetch(url, { method: 'DELETE' });
}
