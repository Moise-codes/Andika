'use client';

import { useState } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Lock, Play, Star, Clock, Target } from "lucide-react";
import Link from "next/link";

const LESSONS = [
  {
    id: 1,
    title: "Home Row Keys",
    description: "Master the home row: A S D F J K L ;",
    duration: "5 min",
    difficulty: "Beginner",
    completed: true,
    lessons: [
      { id: 1, title: "Left Hand: A S D F", completed: true },
      { id: 2, title: "Right Hand: J K L ;", completed: true },
      { id: 3, title: "Combined Practice", completed: true },
    ]
  },
  {
    id: 2,
    title: "Top Row Keys",
    description: "Learn Q W E R and U I O P",
    duration: "8 min",
    difficulty: "Beginner",
    completed: true,
    lessons: [
      { id: 1, title: "Left Hand: Q W E R", completed: true },
      { id: 2, title: "Right Hand: U I O P", completed: true },
      { id: 3, title: "Combined Practice", completed: false },
    ]
  },
  {
    id: 3,
    title: "Bottom Row Keys",
    description: "Practice Z X C V and M , . /",
    duration: "10 min",
    difficulty: "Intermediate",
    completed: false,
    locked: false,
    lessons: [
      { id: 1, title: "Left Hand: Z X C V", completed: false },
      { id: 2, title: "Right Hand: M , . /", completed: false },
      { id: 3, title: "Combined Practice", completed: false },
    ]
  },
  {
    id: 4,
    title: "Capital Letters",
    description: "Master Shift key for capitals",
    duration: "12 min",
    difficulty: "Intermediate",
    completed: false,
    locked: true,
    lessons: [
      { id: 1, title: "Left Shift Practice", completed: false },
      { id: 2, title: "Right Shift Practice", completed: false },
      { id: 3, title: "Mixed Capitals", completed: false },
    ]
  },
  {
    id: 5,
    title: "Numbers & Symbols",
    description: "Type numbers and common symbols",
    duration: "15 min",
    difficulty: "Advanced",
    completed: false,
    locked: true,
    lessons: [
      { id: 1, title: "Number Row: 1-5", completed: false },
      { id: 2, title: "Number Row: 6-0", completed: false },
      { id: 3, title: "Common Symbols", completed: false },
    ]
  },
  {
    id: 6,
    title: "Punctuation Mastery",
    description: "Advanced punctuation and special keys",
    duration: "15 min",
    difficulty: "Advanced",
    completed: false,
    locked: true,
    lessons: [
      { id: 1, title: "Comma & Period", completed: false },
      { id: 2, title: "Quotes & Apostrophes", completed: false },
      { id: 3, title: "Advanced Punctuation", completed: false },
    ]
  },
];

export default function LearnPage() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  if (selectedCourse) {
    const course = LESSONS.find(c => c.id === selectedCourse);
    if (!course) return null;

    return (
      <div className="min-h-screen bg-ivory-light">
        <AppNavigation />

        <main className="container mx-auto px-4 py-8">
          <Button
            onClick={() => setSelectedCourse(null)}
            variant="ghost"
            className="mb-6"
          >
            ← Back to Courses
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-forest-primary mb-2">{course.title}</h1>
            <p className="text-text-secondary">{course.description}</p>
            <div className="flex gap-4 mt-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {course.difficulty}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {course.lessons.map((lesson, index) => (
              <Card key={lesson.id} className={`${lesson.completed ? 'border-forest-primary' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        lesson.completed
                          ? 'bg-forest-primary text-white'
                          : 'bg-ivory-medium text-text-secondary'
                      }`}>
                        {lesson.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{lesson.title}</h3>
                        <p className="text-sm text-text-secondary">
                          {lesson.completed ? 'Completed' : 'Not started'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/learn/lesson/${course.id}-${lesson.id}`}>
                      <Button variant={lesson.completed ? "outline" : "default"}>
                        {lesson.completed ? 'Review' : 'Start'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-light">
      <AppNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-primary mb-2">Learn Typing</h1>
          <p className="text-text-secondary">Structured courses from fundamentals to advanced techniques</p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-gradient-to-r from-forest-primary to-forest-dark text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
                <p className="text-ivory-light/80">2 of 6 courses completed</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">33%</div>
                <div className="text-sm text-ivory-light/80">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LESSONS.map((course) => (
            <Card
              key={course.id}
              className={`hover:border-forest-primary transition-colors ${
                course.locked ? 'opacity-60' : 'cursor-pointer'
              }`}
              onClick={() => !course.locked && setSelectedCourse(course.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    course.completed
                      ? 'bg-forest-primary text-white'
                      : course.locked
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-forest-primary/10 text-forest-primary'
                  }`}>
                    {course.locked ? (
                      <Lock className="w-6 h-6" />
                    ) : course.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary">
                    <Star className="w-4 h-4" />
                    {course.lessons.filter(l => l.completed).length}/{course.lessons.length}
                  </div>
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="w-full bg-neutral rounded-full h-2">
                    <div
                      className="bg-forest-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(course.lessons.filter(l => l.completed).length / course.lessons.length) * 100}%`
                      }}
                    />
                  </div>
                  {course.locked && (
                    <p className="text-xs text-text-secondary text-center">
                      Complete previous lessons to unlock
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
