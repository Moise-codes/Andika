'use client';

import { useState, useEffect } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet, apiPatch } from '@/lib/api-client';
import { signOut } from '@/lib/supabase/auth';

const TYPING_KEYS = [
  'theme',
  'keyboard_layout',
  'caret_style',
  'caret_behavior',
  'show_keyboard',
  'sound_enabled',
  'sound_type',
  'sound_volume',
] as const;

const PROFILE_KEYS = [
  'public_profile',
  'leaderboard_visibility',
  'country_visibility',
  'statistics_visibility',
] as const;

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [profileRes, settingsRes] = await Promise.all([
        apiGet('/users/me'),
        apiGet('/users/me/settings'),
      ]);

      if (profileRes.ok && settingsRes.ok) {
        const profileText = await profileRes.text();
        const settingsText = await settingsRes.text();
        const profile = profileText ? JSON.parse(profileText) : {};
        const settings = settingsText ? JSON.parse(settingsText) : {};
        setSettings({ ...profile, ...settings });
      } else if (profileRes.status === 401 || settingsRes.status === 401) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setSaveMessage(null);

    try {
      const typingUpdate: Record<string, unknown> = {};
      const profileUpdate: Record<string, unknown> = {};

      TYPING_KEYS.forEach((key) => {
        if (settings?.[key] !== undefined) typingUpdate[key] = settings[key];
      });
      PROFILE_KEYS.forEach((key) => {
        if (settings?.[key] !== undefined) profileUpdate[key] = settings[key];
      });

      const [typingRes, profileRes] = await Promise.all([
        Object.keys(typingUpdate).length
          ? apiPatch('/users/me/settings', typingUpdate)
          : Promise.resolve({ ok: true } as Response),
        Object.keys(profileUpdate).length
          ? apiPatch('/users/me', profileUpdate)
          : Promise.resolve({ ok: true } as Response),
      ]);

      if (typingRes.ok && profileRes.ok) {
        setSaveMessage('Settings saved successfully!');
        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      } else if (typingRes.status === 401 || profileRes.status === 401) {
        window.location.href = '/login';
      } else {
        setSaveMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-primary mb-2">Settings</h1>
          <p className="text-text-secondary">Customize your ANDIKA experience</p>
        </div>

        {saveMessage && (
          <div className={`mb-6 p-4 rounded-xl ${saveMessage.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {saveMessage}
          </div>
        )}

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings?.theme || 'forest'}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="forest">Forest (Default)</option>
                  <option value="ivory">Ivory</option>
                  <option value="midnight">Midnight</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Typing Settings</CardTitle>
            <CardDescription>Configure typing behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Keyboard Layout</label>
                <select
                  value={settings?.keyboard_layout || 'qwerty'}
                  onChange={(e) => updateSetting('keyboard_layout', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="qwerty">QWERTY</option>
                  <option value="azerty">AZERTY</option>
                  <option value="qwertz">QWERTZ</option>
                  <option value="dvorak">Dvorak</option>
                  <option value="colemak">Colemak</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Caret Style</label>
                <select
                  value={settings?.caret_style || 'block'}
                  onChange={(e) => updateSetting('caret_style', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="block">Block</option>
                  <option value="line">Line</option>
                  <option value="underline">Underline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Caret Behavior</label>
                <select
                  value={settings?.caret_behavior || 'blink'}
                  onChange={(e) => updateSetting('caret_behavior', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="blink">Blink</option>
                  <option value="static">Static</option>
                  <option value="smooth">Smooth</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Show Keyboard</div>
                  <div className="text-sm text-text-secondary">Display virtual keyboard</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.show_keyboard ?? true}
                  onChange={(e) => updateSetting('show_keyboard', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sound */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sound</CardTitle>
            <CardDescription>Configure sound effects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Sound</div>
                  <div className="text-sm text-text-secondary">Play sound on keystrokes</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.sound_enabled ?? true}
                  onChange={(e) => updateSetting('sound_enabled', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sound Type</label>
                <select
                  value={settings?.sound_type || 'mechanical'}
                  onChange={(e) => updateSetting('sound_type', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="mechanical">Mechanical</option>
                  <option value="soft">Soft</option>
                  <option value="typewriter">Typewriter</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings?.sound_volume ?? 50}
                  onChange={(e) => updateSetting('sound_volume', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Control your data visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Public Profile</div>
                  <div className="text-sm text-text-secondary">Allow others to see your profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.public_profile ?? true}
                  onChange={(e) => updateSetting('public_profile', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Leaderboard Visibility</div>
                  <div className="text-sm text-text-secondary">Show on leaderboards</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.leaderboard_visibility ?? true}
                  onChange={(e) => updateSetting('leaderboard_visibility', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Country Visibility</div>
                  <div className="text-sm text-text-secondary">Show your country on profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.country_visibility ?? true}
                  onChange={(e) => updateSetting('country_visibility', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Statistics Visibility</div>
                  <div className="text-sm text-text-secondary">Show your typing statistics</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.statistics_visibility ?? true}
                  onChange={(e) => updateSetting('statistics_visibility', e.target.checked)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={async () => {
                  await signOut();
                  window.location.href = '/login';
                }}
                variant="destructive"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={isLoading}
            className="btn-andika-primary"
          >
            {isLoading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </main>
    </div>
  );
}
