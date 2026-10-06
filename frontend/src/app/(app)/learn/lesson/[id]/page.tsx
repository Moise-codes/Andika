'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, Target } from "lucide-react";
import TypingEngine, { TypingResult } from "@/components/domain/TypingEngine";
import { apiGet, apiPost } from '@/lib/api-client';
import { getAccessToken } from '@/lib/supabase/auth';

const LESSON_CONTENT: Record<string, string> = {
  '1-1': 'asdf asdf asdf asdf asdf jkl; jkl; jkl; jkl;',
  '1-2': 'jkl; jkl; jkl; jkl; asdf asdf asdf asdf',
  '1-3': 'asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
  '2-1': 'qwer qwer qwer qwer asdf asdf asdf',
  '2-2': 'uiop uiop uiop jkl; jkl; jkl;',
  '2-3': 'qwer asdf jkl; uiop qwer asdf jkl;',
  '3-1': 'zxcv zxcv zxcv asdf asdf asdf',
  '3-2': 'm,./ m,./ m,./ jkl; jkl; jkl;',
  '3-3': 'zxcv asdf m,./ jkl; zxcv asdf m,./',
};

const LESSON_INFO: Record<string, { title: string; description: string; duration: string }> = {
  '1-1': { title: 'Left Hand: A S D F', description: 'Practice the left hand home row keys', duration: '5 min' },
  '1-2': { title: 'Right Hand: J K L ;', description: 'Practice the right hand home row keys', duration: '5 min' },
  '1-3': { title: 'Combined Practice', description: 'Practice both hands together', duration: '5 min' },
  '2-1': { title: 'Left Hand: Q W E R', description: 'Practice the top row left hand', duration: '8 min' },
  '2-2': { title: 'Right Hand: U I O P', description: 'Practice the top row right hand', duration: '8 min' },
  '2-3': { title: 'Combined Practice', description: 'Practice top row with both hands', duration: '8 min' },
  '3-1': { title: 'Left Hand: Z X C V', description: 'Practice the bottom row left hand', duration: '10 min' },
  '3-2': { title: 'Right Hand: M , . /', description: 'Practice the bottom row right hand', duration: '10 min' },
  '3-3': { title: 'Combined Practice', description: 'Practice bottom row with both hands', duration: '10 min' },
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [result, setResult] = useState<TypingResult | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const lessonInfo = LESSON_INFO[lessonId] || { title: 'Lesson', description: 'Practice typing', duration: '5 min' };
  const lessonText = LESSON_CONTENT[lessonId] || 'asdf jkl; asdf jkl; asdf jkl;';

  useEffect(() => {
    fetchProgress();
  }, [lessonId]);

  const fetchProgress = async () => {
    try {
      const res = await apiGet(`/lessons/${lessonId}/progress`);
      if (res.ok) {
        const text = await res.text();
        if (text) {
          setProgress(JSON.parse(text));
        }
      }
    } catch (error) {
      console.error('Failed to fetch lesson progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (testResult: TypingResult) => {
    setResult(testResult);

    // Save progress to backend
    try {
      await apiPost(`/lessons/${lessonId}/progress`, {
        completed: true,
        wpm: testResult.wpm,
        accuracy: testResult.accuracy,
        timeSpent: testResult.timeElapsed,
      });
    } catch (error) {
      console.error('Failed to save lesson progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-light">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-ivory-light p-8">
        <AppNavigation />
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => router.back()} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Lesson Complete!</CardTitle>
              <CardDescription>Great job on completing this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-forest-primary">{result.wpm}</div>
                  <div className="text-text-secondary">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-forest-primary">{result.accuracy}%</div>
                  <div className="text-text-secondary">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-forest-primary">{result.correctChars}</div>
                  <div className="text-text-secondary">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-forest-primary">{result.incorrectChars}</div>
                  <div className="text-text-secondary">Errors</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setResult(null)} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/learn')} variant="outline" className="flex-1">
                  Back to Lessons
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <Button onClick={() => router.push('/learn')} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forest-primary mb-2">{lessonInfo.title}</h1>
            <p className="text-text-secondary mb-4">{lessonInfo.description}</p>
            <div className="flex gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {lessonInfo.duration}
              </span>
              {progress?.completed && (
                <span className="flex items-center gap-1 text-forest-primary">
                  <CheckCircle className="w-4 h-4" />
                  Previously completed
                </span>
              )}
            </div>
          </div>

          <TypingEngine
            text={lessonText}
            onComplete={handleComplete}
            timeLimit={300}
            soundEnabled={true}
          />
        </div>
      </main>
    </div>
  );
}
