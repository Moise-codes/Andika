// Test mode utility for MVP testing - bypasses authentication
// This allows testing the app without requiring actual login

export const TEST_MODE_KEY = 'andika_test_mode';

export function enableTestMode() {
  localStorage.setItem(TEST_MODE_KEY, 'true');
  // Set mock user data
  localStorage.setItem('mockUser', JSON.stringify({
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    username: 'testuser',
    joinedDate: new Date().toISOString().split('T')[0],
  }));
  window.location.reload();
}

export function disableTestMode() {
  localStorage.removeItem(TEST_MODE_KEY);
  localStorage.removeItem('mockUser');
  window.location.reload();
}

export function isTestMode(): boolean {
  return localStorage.getItem(TEST_MODE_KEY) === 'true';
}

export function getTestUser() {
  if (isTestMode()) {
    const user = localStorage.getItem('mockUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

// Add this to browser console to enable test mode:
// window.enableTestMode()
if (typeof window !== 'undefined') {
  (window as any).enableTestMode = enableTestMode;
  (window as any).disableTestMode = disableTestMode;
  (window as any).isTestMode = isTestMode;
}
