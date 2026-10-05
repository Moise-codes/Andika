'use client';

import { useState, useEffect } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [overview, setOverview] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [weakKeys, setWeakKeys] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const [overviewRes, performanceRes, weakKeysRes] = await Promise.all([
        fetch(`${apiUrl}/analytics/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiUrl}/analytics/performance?days=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiUrl}/analytics/weak-keys`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (performanceRes.ok) setPerformance(await performanceRes.json());
      if (weakKeysRes.ok) setWeakKeys(await weakKeysRes.json());

      // If unauthorized, redirect to login
      if (overviewRes.status === 401 || performanceRes.status === 401 || weakKeysRes.status === 401) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const wpmData = performance.map((p: any) => ({
    date: new Date(p.date).toLocaleDateString(),
    wpm: p.wpm,
  }));

  const accuracyData = performance.map((p: any) => ({
    date: new Date(p.date).toLocaleDateString(),
    accuracy: p.accuracy,
  }));

  const consistencyData = performance.map((p: any) => ({
    date: new Date(p.date).toLocaleDateString(),
    consistency: p.consistency || 0,
  }));

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-primary mb-2">Analytics</h1>
          <p className="text-text-secondary">Track your typing progress over time</p>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Current WPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest-primary">{overview.currentWpm}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average WPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest-primary">{Math.round(overview.averageWpm)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Best WPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest-primary">{overview.bestWpm}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-forest-primary">{Math.round(overview.accuracy)}%</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8">
          {['7', '30', '90', '365'].map((days) => (
            <Button
              key={days}
              variant={timeRange === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(days)}
            >
              {days === '365' ? 'All Time' : `${days} Days`}
            </Button>
          ))}
        </div>

        {/* Performance Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>WPM Progression</CardTitle>
              <CardDescription>Your typing speed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={256}>
                <LineChart data={wpmData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="wpm" stroke="#415239" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Progression</CardTitle>
              <CardDescription>Your accuracy over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={256}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#415239" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Consistency */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consistency Trends</CardTitle>
            <CardDescription>How stable your performance is</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={consistencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="consistency" stroke="#415239" fill="#415239" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weak Keys Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weak Keys Analysis</CardTitle>
            <CardDescription>Keys that need more practice</CardDescription>
          </CardHeader>
          <CardContent>
            {weakKeys.length > 0 ? (
              <div className="space-y-4">
                {weakKeys.slice(0, 5).map((key, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-ivory-medium rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-forest-primary text-ivory-light rounded-md flex items-center justify-center font-bold">
                        {key.key.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{key.key.toUpperCase()} Key</div>
                        <div className="text-sm text-text-secondary">
                          {Math.round(key.errorRate * 100)}% error rate ({key.incorrect} errors)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-forest-primary">
                        {Math.round((key.incorrect / (key.correct + key.incorrect)) * 10)} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">No data available yet. Take some tests to see your weak keys!</p>
            )}
          </CardContent>
        </Card>

        {/* Practice Time */}
        <Card>
          <CardHeader>
            <CardTitle>Total Practice Time</CardTitle>
            <CardDescription>Total time spent practicing</CardDescription>
          </CardHeader>
          <CardContent>
            {overview ? (
              <div className="text-center py-8">
                <div className="text-5xl font-bold text-forest-primary mb-2">
                  {Math.round(overview.totalTime / 60)}h
                </div>
                <div className="text-text-secondary">
                  {Math.round(overview.totalTime % 60)} minutes
                </div>
                <div className="text-text-secondary mt-2">
                  {overview.totalTests} tests completed
                </div>
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">No data available yet.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
