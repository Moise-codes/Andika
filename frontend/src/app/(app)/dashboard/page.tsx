'use client';

import { useState, useEffect } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Target, TrendingUp, Trophy, Code, Flame, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost } from '@/lib/api-client';

const T = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceWarm: '#F4F0E7',
  border: '#D9D7CF',
  borderStrong: '#C4C0B8',
  ink: '#30302E',
  body: '#696A64',
  muted: '#8A8B85',
  accent: '#415239',
  accentSoft: '#4A7C42',
  accentLight: '#8FB877',
  dark: '#34442F',
  success: '#10B981',
  warning: '#F59E0B'
};

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    currentWpm: 0,
    averageWpm: 0,
    accuracy: 0,
    streak: 0,
    totalPracticeTime: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh dashboard when user returns from practice/test
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // First sync profile to ensure it exists
      await apiPost('/auth/sync').catch((err) => {
        console.log('Sync failed (may be expected):', err);
      });

      // Fetch user profile
      const profileRes = await apiGet('/auth/me');
      if (profileRes.ok) {
        const text = await profileRes.text();
        if (text) {
          const profile = JSON.parse(text);
          console.log('User:', profile.username);
        }
      } else if (profileRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      const statsRes = await apiGet('/users/me/stats');
      if (statsRes.ok) {
        const text = await statsRes.text();
        if (text) {
          const statsData = JSON.parse(text);
          setStats({
            currentWpm: statsData.current_wpm || 0,
            averageWpm: statsData.average_wpm || 0,
            accuracy: statsData.average_accuracy || 0,
            streak: statsData.streak?.current_streak || 0,
            totalPracticeTime: statsData.total_practice_time || 0,
          });
        }
      } else if (statsRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      const sessionsRes = await apiGet('/typing/sessions?limit=5');
      if (sessionsRes.ok) {
        const text = await sessionsRes.text();
        if (text) {
          setRecentSessions(JSON.parse(text));
        }
      } else if (sessionsRes.status === 401) {
        window.location.href = '/login';
        return;
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
      <AppNavigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight" style={{ color: T.ink }}>
              {loading ? 'Loading...' : 'Welcome back!'}
            </h1>
            <p className="text-sm mt-1" style={{ color: T.body }}>
              {loading ? 'Setting up your dashboard...' : 'Continue your typing journey'}
            </p>
          </div>
          <Link href="/test">
            <Button className="btn-andika-primary px-5 py-2.5 rounded-lg text-white text-sm font-semibold flex items-center gap-2">
              Quick Practice
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid - Compact 4-col */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <Card className="rounded-xl p-3.5 border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <Zap className="w-4 h-4" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: T.body }}>Current WPM</p>
                <p className="text-lg font-bold" style={{ color: T.ink }}>{loading ? '--' : stats.currentWpm}</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-3.5 border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <TrendingUp className="w-4 h-4" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: T.body }}>Average WPM</p>
                <p className="text-lg font-bold" style={{ color: T.ink }}>{loading ? '--' : stats.averageWpm}</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-3.5 border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <Target className="w-4 h-4" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: T.body }}>Accuracy</p>
                <p className="text-lg font-bold" style={{ color: T.ink }}>{loading ? '--' : Math.round(stats.accuracy)}%</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-3.5 border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <Flame className="w-4 h-4" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: T.body }}>Streak</p>
                <p className="text-lg font-bold" style={{ color: T.ink }}>{loading ? '--' : stats.streak} days</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-3.5 border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <Clock className="w-4 h-4" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: T.body }}>Practice Time</p>
                <p className="text-lg font-bold" style={{ color: T.ink }}>{loading ? '--' : formatTime(stats.totalPracticeTime)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="rounded-xl border p-5 hover:border-[#415239] transition-colors cursor-pointer" style={{ borderColor: T.border }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.surfaceWarm }}>
                <BookOpen className="w-5 h-5" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: T.ink }}>Continue Learning</h3>
                <p className="text-xs mt-1" style={{ color: T.body }}>Resume your last lesson</p>
                <Link href="/learn" className="inline-flex items-center gap-1 text-xs font-semibold mt-3" style={{ color: T.accent }}>
                  Continue <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl border p-5 hover:border-[#415239] transition-colors cursor-pointer" style={{ borderColor: T.border }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.surfaceWarm }}>
                <Target className="w-5 h-5" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: T.ink }}>Quick Practice</h3>
                <p className="text-xs mt-1" style={{ color: T.body }}>5-minute practice session</p>
                <Link href="/practice" className="inline-flex items-center gap-1 text-xs font-semibold mt-3" style={{ color: T.accent }}>
                  Start <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl border p-5 hover:border-[#415239] transition-colors cursor-pointer" style={{ borderColor: T.border }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.surfaceWarm }}>
                <Trophy className="w-5 h-5" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: T.ink }}>Take a Test</h3>
                <p className="text-xs mt-1" style={{ color: T.body }}>Measure your progress</p>
                <Link href="/test" className="inline-flex items-center gap-1 text-xs font-semibold mt-3" style={{ color: T.accent }}>
                  Start <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="rounded-xl border mb-6" style={{ borderColor: T.border }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold" style={{ color: T.ink }}>Recent Activity</CardTitle>
            <CardDescription className="text-xs" style={{ color: T.body }}>Your latest typing sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: T.surfaceWarm }}>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4" style={{ color: T.body }} />
                      <div>
                        <div className="font-semibold text-sm" style={{ color: T.ink }}>
                          {session.mode === 'time' ? `${session.duration}s Test` : `${session.word_count} Words`}
                        </div>
                        <div className="text-xs" style={{ color: T.body }}>
                          {new Date(session.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm" style={{ color: T.accent }}>{Math.round(session.wpm)} WPM</div>
                      <div className="text-xs" style={{ color: T.body }}>{Math.round(session.accuracy)}% accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-4" style={{ color: T.body }}>
                {loading ? 'Loading...' : 'No recent sessions. Start practicing!'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Programming Typing */}
        <Card className="rounded-xl border" style={{ borderColor: T.border }}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <Code className="w-5 h-5" style={{ color: T.accent }} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold" style={{ color: T.ink }}>Programming Typing</CardTitle>
                <CardDescription className="text-xs" style={{ color: T.body }}>Practice typing real code in multiple languages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/programming">
              <Button variant="outline" className="btn-andika-outline px-4 py-2 rounded-lg text-sm font-semibold">
                Try Programming Mode <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
