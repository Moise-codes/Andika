'use client';

import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Target, TrendingUp, Trophy, Code, Flame, Clock, Zap } from "lucide-react";
import Link from "next/link";

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

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
      <AppNavigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight" style={{ color: T.ink }}>
              Welcome back!
            </h1>
            <p className="text-sm mt-1" style={{ color: T.body }}>
              Continue your typing journey
            </p>
          </div>
          <Link href="/practice">
            <Button className="btn-andika-primary px-5 py-2.5 rounded-lg text-white text-sm font-semibold flex items-center gap-2">
              Quick Practice
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid - Compact 4-col */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="rounded-xl p-3.5 border" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.surfaceWarm }}>
                <Zap className="w-4 h-4" style={{ color: T.accent }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: T.body }}>Current WPM</p>
                <p className="text-lg font-bold" style={{ color: T.ink }}>65</p>
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
                <p className="text-lg font-bold" style={{ color: T.ink }}>58</p>
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
                <p className="text-lg font-bold" style={{ color: T.ink }}>92%</p>
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
                <p className="text-lg font-bold" style={{ color: T.ink }}>7 days</p>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: T.surfaceWarm }}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: T.body }} />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: T.ink }}>60-Second Test</div>
                    <div className="text-xs" style={{ color: T.body }}>2 hours ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: T.accent }}>68 WPM</div>
                  <div className="text-xs" style={{ color: T.body }}>94% accuracy</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: T.surfaceWarm }}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: T.body }} />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: T.ink }}>Practice: Weak Keys</div>
                    <div className="text-xs" style={{ color: T.body }}>Yesterday</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: T.accent }}>62 WPM</div>
                  <div className="text-xs" style={{ color: T.body }}>91% accuracy</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: T.surfaceWarm }}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: T.body }} />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: T.ink }}>Lesson: Home Row</div>
                    <div className="text-xs" style={{ color: T.body }}>2 days ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: T.accent }}>55 WPM</div>
                  <div className="text-xs" style={{ color: T.body }}>89% accuracy</div>
                </div>
              </div>
            </div>
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
