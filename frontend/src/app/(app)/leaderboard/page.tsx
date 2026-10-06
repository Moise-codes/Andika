'use client';

import { useState, useEffect } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown } from "lucide-react";
import { apiGet } from '@/lib/api-client';

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<'global' | 'weekly' | 'monthly' | 'all-time'>('global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeRange]);

  const fetchLeaderboard = async () => {
    try {
      let endpoint = '/leaderboards/global';
      if (timeRange === 'weekly') endpoint = '/leaderboards/weekly';
      else if (timeRange === 'monthly') endpoint = '/leaderboards/monthly';
      else if (timeRange === 'all-time') endpoint = '/leaderboards/all-time';

      const res = await apiGet(`${endpoint}?limit=100`);

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (res.ok) {
        const text = await res.text();
        if (text) setLeaderboard(JSON.parse(text));
      }

      // Fetch user's rank and stats
      const userStatsRes = await apiGet('/users/me/stats');

      if (userStatsRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (userStatsRes.ok) {
        const text = await userStatsRes.text();
        if (text) setUserRank(JSON.parse(text));
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-primary mb-2">Leaderboard</h1>
          <p className="text-text-secondary">See how you rank against other typists</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={timeRange === 'global' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('global')}
          >
            Global
          </Button>
          <Button
            variant={timeRange === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={timeRange === 'all-time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('all-time')}
          >
            All Time
          </Button>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="order-2 md:order-1">
              <CardHeader className="text-center">
                <Medal className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <CardTitle className="text-2xl">2nd Place</CardTitle>
                <CardDescription>{top3[1]?.username || 'Unknown'}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-forest-primary">{top3[1]?.bestWpm || 0} WPM</div>
                <div className="text-sm text-text-secondary mt-2">{Math.round(top3[1]?.bestAccuracy || 0)}% accuracy</div>
              </CardContent>
            </Card>

            <Card className="order-1 md:order-2 border-forest-primary border-2">
              <CardHeader className="text-center">
                <Crown className="h-12 w-12 text-forest-primary mx-auto mb-2" />
                <CardTitle className="text-2xl">1st Place</CardTitle>
                <CardDescription>{top3[0]?.username || 'Unknown'}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-forest-primary">{top3[0]?.bestWpm || 0} WPM</div>
                <div className="text-sm text-text-secondary mt-2">{Math.round(top3[0]?.bestAccuracy || 0)}% accuracy</div>
              </CardContent>
            </Card>

            <Card className="order-3">
              <CardHeader className="text-center">
                <Medal className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                <CardTitle className="text-2xl">3rd Place</CardTitle>
                <CardDescription>{top3[2]?.username || 'Unknown'}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-forest-primary">{top3[2]?.bestWpm || 0} WPM</div>
                <div className="text-sm text-text-secondary mt-2">{Math.round(top3[2]?.bestAccuracy || 0)}% accuracy</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <Trophy className="h-6 w-6 text-forest-primary mb-2" />
            <CardTitle>Full Rankings</CardTitle>
            <CardDescription>Top 100 typists</CardDescription>
          </CardHeader>
          <CardContent>
            {remaining.length > 0 ? (
              <div className="space-y-2">
                {remaining.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-ivory-medium rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center font-bold text-forest-primary">{index + 4}</div>
                      <div>
                        <div className="font-semibold">{entry.username}</div>
                        <div className="text-sm text-text-secondary">{entry.country || 'Unknown'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.bestWpm} WPM</div>
                      <div className="text-sm text-text-secondary">{Math.round(entry.bestAccuracy)}% accuracy</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">No leaderboard data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Your Position */}
        {userRank && (
          <Card className="mt-8 border-forest-primary">
            <CardHeader>
              <CardTitle>Your Position</CardTitle>
              <CardDescription>Your current typing statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-ivory-medium rounded-md">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-forest-primary">
                    {leaderboard.findIndex((e: any) => e.username === userRank.username) + 1 || '--'}
                  </div>
                  <div>
                    <div className="font-semibold">{userRank.username}</div>
                    <div className="text-sm text-text-secondary">Your best performance</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{Math.round(userRank.current_wpm)} WPM</div>
                  <div className="text-sm text-text-secondary">{Math.round(userRank.average_accuracy)}% accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
