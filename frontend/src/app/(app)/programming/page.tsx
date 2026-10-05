'use client';

import { useState, useEffect, useRef } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Button } from "@/components/ui/button";
import { RotateCcw, Timer, Target, Flame, Code } from "lucide-react";

const T = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceWarm: '#F4F0E7',
  border: '#D9D7CF',
  ink: '#30302E',
  body: '#696A64',
  accent: '#415239',
  accentLight: '#8FB877',
  error: '#EF4444',
  correct: '#10B981'
};

const PROGRAMMING_SNIPPETS = {
  javascript: [
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
const filtered = users.filter(u => u.id > 1);`,
    `async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}`,
  ],
  typescript: [
    `interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
};`,
    `type Result<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};`,
  ],
  python: [
    `def quicksort(arr):
  if len(arr) <= 1:
    return arr
  pivot = arr[len(arr) // 2]
  left = [x for x in arr if x < pivot]`,
    `class Node:
  def __init__(self, value):
    self.value = value
    self.next = None`,
  ],
  html: [
    `<!DOCTYPE html>
<html>
<head>
  <title>ANDIKA</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
  ],
};

export default function ProgrammingPage() {
  const [language, setLanguage] = useState<keyof typeof PROGRAMMING_SNIPPETS>('javascript');
  const [snippet, setSnippet] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadRandomSnippet();
  }, [language]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeLeft]);

  const loadRandomSnippet = () => {
    const snippets = PROGRAMMING_SNIPPETS[language];
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    setSnippet(randomSnippet);
    setCurrentInput('');
  };

  const handleLanguageChange = (newLanguage: keyof typeof PROGRAMMING_SNIPPETS) => {
    setLanguage(newLanguage);
    restartTest();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    if (!startTime && isStarted) {
      setStartTime(Date.now());
    }

    // Calculate correct characters
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === snippet[i]) {
        correct++;
      }
    }

    setCorrectChars(correct);
    setTotalChars(value.length);

    // Check if completed
    if (value === snippet) {
      finishTest();
    }
  };

  const calculateStats = () => {
    const timeElapsed = (60 - timeLeft) / 60;
    const calculatedWpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
    const calculatedAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  };

  const finishTest = () => {
    setIsFinished(true);
    setIsStarted(false);
    calculateStats();
  };

  const restartTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setCurrentInput('');
    setStartTime(null);
    loadRandomSnippet();
    inputRef.current?.focus();
  };

  const renderSnippet = () => {
    return snippet.split('').map((char, index) => {
      const inputChar = currentInput[index];
      const isCorrect = inputChar === char;
      const isTyped = index < currentInput.length;

      return (
        <span
          key={index}
          className={
            isTyped
              ? isCorrect
                ? 'text-green-600'
                : 'text-red-500 bg-red-100'
              : 'text-gray-400'
          }
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
      <AppNavigation />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: T.ink }}>Programming Typing</h1>
          <p className="text-sm" style={{ color: T.body }}>Practice typing real code in multiple programming languages</p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(Object.keys(PROGRAMMING_SNIPPETS) as Array<keyof typeof PROGRAMMING_SNIPPETS>).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                language === lang ? 'btn-andika-primary text-white' : 'bg-white text-gray-700 border-2'
              }`}
            >
              <Code className="w-4 h-4" />
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" style={{ color: T.accent }} />
              <span className="text-2xl font-bold" style={{ color: T.ink }}>
                {isFinished ? '0:00' : `0:${timeLeft.toString().padStart(2, '0')}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: T.accent }} />
              <span className="text-2xl font-bold" style={{ color: T.ink }}>{wpm}</span>
              <span className="text-sm" style={{ color: T.body }}>WPM</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: T.accent }} />
              <span className="text-2xl font-bold" style={{ color: T.ink }}>{accuracy}%</span>
              <span className="text-sm" style={{ color: T.body }}>acc</span>
            </div>
          </div>
          <Button
            onClick={restartTest}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold btn-andika-outline"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </Button>
        </div>

        {/* Typing Area */}
        <div className="rounded-2xl border p-8 mb-6" style={{ backgroundColor: T.surface, borderColor: T.border }}>
          {!isFinished ? (
            <>
              {/* Code Display */}
              <div className="font-mono text-lg leading-relaxed mb-6 p-4 rounded-xl" style={{ backgroundColor: T.surfaceWarm, color: T.ink }}>
                <pre className="whitespace-pre-wrap">{renderSnippet()}</pre>
              </div>

              {/* Input */}
              <textarea
                ref={inputRef}
                value={currentInput}
                onChange={handleInputChange}
                disabled={isFinished}
                className="w-full font-mono text-lg p-4 rounded-xl border-2 bg-transparent outline-none transition-all resize-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  minHeight: '150px'
                }}
                placeholder={isStarted ? '' : 'Click here and start typing...'}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    restartTest();
                  }
                  if (!isStarted && !isFinished) {
                    setIsStarted(true);
                  }
                }}
              />
            </>
          ) : (
            /* Results */
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold mb-8" style={{ color: T.ink }}>Test Complete!</h2>
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                <div className="p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: T.accent }}>{wpm}</div>
                  <div className="text-sm" style={{ color: T.body }}>WPM</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: T.accent }}>{accuracy}%</div>
                  <div className="text-sm" style={{ color: T.body }}>Accuracy</div>
                </div>
              </div>

              <div className="max-w-lg mx-auto mb-8 p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: T.ink }}>How You Typed</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <div className="text-sm" style={{ color: T.body }}>Characters</div>
                    <div className="text-xl font-bold" style={{ color: T.ink }}>{totalChars}</div>
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: T.body }}>Correct</div>
                    <div className="text-xl font-bold" style={{ color: T.correct }}>{correctChars}</div>
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: T.body }}>Incorrect</div>
                    <div className="text-xl font-bold" style={{ color: T.error }}>{totalChars - correctChars}</div>
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: T.body }}>Language</div>
                    <div className="text-xl font-bold" style={{ color: T.ink }}>{language}</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={restartTest}
                className="px-8 py-3 rounded-lg text-white font-semibold btn-andika-primary"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm" style={{ color: T.body }}>
          Press <kbd className="px-2 py-1 rounded" style={{ backgroundColor: T.surfaceWarm }}>Tab</kbd> to restart
        </div>
      </main>
    </div>
  );
}
