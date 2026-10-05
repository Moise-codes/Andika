'use client';

import { useState, useEffect } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, TrendingUp } from "lucide-react";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
  }, [params.username]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const [profileRes, achievementsRes, sessionsRes] = await Promise.all([
        fetch(`${apiUrl}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiUrl}/achievements/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiUrl}/typing/sessions/recent`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (profileRes.status === 401 || achievementsRes.status === 401 || sessionsRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (profileRes.ok) setProfile(await profileRes.json());
      if (achievementsRes.ok) setAchievements(await achievementsRes.json());
      if (sessionsRes.ok) setRecentSessions(await sessionsRes.json());
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-primary mb-2">{profile?.username || params.username}</h1>
          <p className="text-text-secondary">Typing enthusiast</p>
        </div>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Best WPM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">{profile?.typing_sessions?.[0]?.wpm || '--'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Average WPM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">
                {profile?.typing_sessions?.length > 0
                  ? Math.round(profile.typing_sessions.reduce((sum: number, s: any) => sum + s.wpm, 0) / profile.typing_sessions.length)
                  : '--'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Tests Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">{profile?.typing_sessions?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-primary">{profile?.streak?.current_streak || 0} days</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <Trophy className="h-6 w-6 text-forest-primary mb-2" />
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Recent achievements unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.slice(0, 4).map((achievement: any) => (
                  <div key={achievement.id} className="text-center p-4 bg-ivory-medium rounded-md">
                    <div className="text-2xl mb-2">{achievement.icon || '�'}</div>
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-text-secondary">{achievement.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">No achievements unlocked yet.</p>
            )}
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
