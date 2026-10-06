'use client';

import { useState, useEffect, use } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, TrendingUp } from "lucide-react";
import { apiGet } from '@/lib/api-client';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
  }, [resolvedParams.username]);

  const fetchProfile = async () => {
    try {
      const username = resolvedParams.username;
      const [profileRes, sessionsRes] = await Promise.all([
        apiGet(`/users/${username}`),
        apiGet(`/typing/sessions?limit=10`),
      ]);

      if (profileRes.status === 401 || sessionsRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (profileRes.ok) {
        const text = await profileRes.text();
        if (text) setProfile(JSON.parse(text));
      }
      if (sessionsRes.ok) {
        const text = await sessionsRes.text();
        if (text) setRecentSessions(JSON.parse(text));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-primary mb-2">{profile?.username || resolvedParams.username}</h1>
          <p className="text-text-secondary">Typing enthusiast</p>
        </div>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Best WPM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">
                {recentSessions.length > 0 ? Math.round(Math.max(...recentSessions.map((s: any) => s.wpm))) : '--'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Average WPM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">
                {recentSessions.length > 0
                  ? Math.round(recentSessions.reduce((sum: number, s: any) => sum + s.wpm, 0) / recentSessions.length)
                  : '--'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Tests Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">{recentSessions.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">
                {recentSessions.length > 0
                  ? Math.round(recentSessions.reduce((sum: number, s: any) => sum + s.accuracy, 0) / recentSessions.length)
                  : '--'}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <Trophy className="h-6 w-6 text-forest-primary mb-2" />
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Milestones reached</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-ivory-medium rounded-md">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-sm">First Test</div>
                <div className="text-xs text-text-secondary">Completed your first typing test</div>
              </div>
              <div className="text-center p-4 bg-ivory-medium rounded-md opacity-50">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-sm">Speed Demon</div>
                <div className="text-xs text-text-secondary">Reach 60 WPM</div>
              </div>
              <div className="text-center p-4 bg-ivory-medium rounded-md opacity-50">
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-semibold text-sm">On Fire</div>
                <div className="text-xs text-text-secondary">7 day streak</div>
              </div>
              <div className="text-center p-4 bg-ivory-medium rounded-md opacity-50">
                <div className="text-2xl mb-2">💯</div>
                <div className="font-semibold text-sm">Perfectionist</div>
                <div className="text-xs text-text-secondary">100% accuracy test</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <Calendar className="h-6 w-6 text-forest-primary mb-2" />
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest typing sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-ivory-medium rounded-md">
                    <div>
                      <div className="font-semibold">{session.mode || 'Standard Test'}</div>
                      <div className="text-sm text-text-secondary">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-forest-primary">{session.wpm} WPM</div>
                      <div className="text-sm text-text-secondary">{Math.round(session.accuracy)}% accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
