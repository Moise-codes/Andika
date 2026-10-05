'use client';

import { useEffect } from 'react';

export function TestModeLoader() {
  useEffect(() => {
    const TEST_MODE_KEY = 'andika_test_mode';

    window.enableTestMode = () => {
      localStorage.setItem(TEST_MODE_KEY, 'true');
      localStorage.setItem('mockUser', JSON.stringify({
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        joinedDate: new Date().toISOString().split('T')[0],
      }));
      // Set mock access token for API calls
      localStorage.setItem('access_token', 'test-mode-token');
      localStorage.setItem('refresh_token', 'test-mode-refresh-token');
      window.location.reload();
    };

    window.disableTestMode = () => {
      localStorage.removeItem(TEST_MODE_KEY);
      localStorage.removeItem('mockUser');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.reload();
    };

    window.isTestMode = () => {
      return localStorage.getItem(TEST_MODE_KEY) === 'true';
    };

    console.log('%c Test Mode Loaded ', 'background: #415239; color: white; padding: 4px; border-radius: 4px;');
    console.log('Use: window.enableTestMode() to bypass authentication');
    console.log('Use: window.disableTestMode() to disable test mode');
  }, []);

  return null;
}
