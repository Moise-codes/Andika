"use client";

import { useState } from "react";
import TypingEngine, { TypingResult } from "@/components/domain/TypingEngine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

const SAMPLE_TEXTS = {
  plain: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
    "To improve your typing speed, practice regularly and focus on accuracy first. Speed will naturally follow as your muscle memory develops.",
    "Programming requires precise typing. Small errors in code can cause bugs that are difficult to track down and fix.",
  ],
  quotes: [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Stay hungry, stay foolish. - Steve Jobs",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "In the middle of difficulty lies opportunity. - Albert Einstein",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  ],
  numbers: [
    "The quick brown fox jumps over 5 lazy dogs. 100 percent of 10 people agree that practice makes perfect.",
    "In 2024, 50 million people learned to type online. 1 in 3 users improved their speed by 20 WPM.",
    "The temperature is 72 degrees. The price is $19.99. Call 555-1234 for more information.",
  ],
  code: [
    "function calculateWPM(chars, time) { return Math.round((chars / 5) / (time / 60)); }",
    "const user = { name: 'John', age: 25, email: 'john@example.com' };",
    "if (isValid) { return true; } else { return false; }",
    "import React from 'react'; export default function App() { return <div>Hello</div>; }",
  ],
  punctuation: [
    "Hello, world! How are you today? I'm doing great, thanks for asking.",
    "The quick brown fox jumps over the lazy dog; however, the dog didn't seem to mind.",
    "Don't forget to practice every day! It's the key to success—believe me.",
  ],
  custom: [] as string[],
};

interface TestOptions {
  numbers: boolean;
  symbols: boolean;
  punctuation: boolean;
  blindMode: boolean;
  instantDeath: boolean;
  soundEnabled: boolean;
}

export default function TestPage() {
  const [mode, setMode] = useState<"time" | "words">("time");
  const [duration, setDuration] = useState(60);
  const [wordCount, setWordCount] = useState(50);
  const [contentType, setContentType] = useState<"plain" | "quotes" | "numbers" | "code" | "punctuation" | "custom">("plain");
  const [result, setResult] = useState<TypingResult | null>(null);
  const [selectedText, setSelectedText] = useState(SAMPLE_TEXTS.plain[0]);
  const [customText, setCustomText] = useState("");
  const [options, setOptions] = useState<TestOptions>({
    numbers: false,
    symbols: false,
    punctuation: false,
    blindMode: false,
    instantDeath: false,
    soundEnabled: true,
  });

  const handleStart = () => {
    setResult(null);
    if (contentType === "custom") {
      if (!customText.trim()) {
        alert("Please enter custom text");
        return;
      }
      setSelectedText(customText);
    } else {
      const texts = SAMPLE_TEXTS[contentType];
      setSelectedText(texts[Math.floor(Math.random() * texts.length)]);
    }
  };

  const handleComplete = (testResult: TypingResult) => {
    setResult(testResult);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-ivory-light p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Back to Home</Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Here's how you typed</CardDescription>
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

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Error Analysis</h3>
                {result.errors.length > 0 ? (
                  <div className="space-y-2">
                    {result.errors.slice(0, 10).map((error, i) => (
                      <div key={i} className="flex gap-4 text-sm">
                        <span className="text-text-secondary">Position {error.index}:</span>
                        <span className="text-red-600">Typed "{error.actual}"</span>
                        <span className="text-text-secondary">instead of</span>
                        <span className="text-forest-primary">"{error.expected}"</span>
                      </div>
                    ))}
                    {result.errors.length > 10 && (
                      <p className="text-text-secondary text-sm">...and {result.errors.length - 10} more errors</p>
                    )}
                  </div>
                ) : (
                  <p className="text-text-secondary">Perfect! No errors.</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button onClick={handleStart} className="flex-1">Try Again</Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-light p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">← Back to Home</Button>
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Typing Test</CardTitle>
            <CardDescription>Configure your test settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "time" | "words")}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="time">Time-based</option>
                  <option value="words">Word-based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {mode === "time" ? "Duration (seconds)" : "Word count"}
                </label>
                <select
                  value={mode === "time" ? duration : wordCount}
                  onChange={(e) => mode === "time" ? setDuration(Number(e.target.value)) : setWordCount(Number(e.target.value))}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  {mode === "time" ? (
                    <>
                      <option value={15}>15 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>60 seconds</option>
                      <option value={120}>120 seconds</option>
                    </>
                  ) : (
                    <>
                      <option value={10}>10 words</option>
                      <option value={25}>25 words</option>
                      <option value={50}>50 words</option>
                      <option value={100}>100 words</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as "plain" | "quotes" | "numbers" | "code" | "punctuation" | "custom")}
                  className="w-full p-2 border border-border rounded-md bg-ivory-light"
                >
                  <option value="plain">Plain text</option>
                  <option value="quotes">Quotes</option>
                  <option value="numbers">Numbers</option>
                  <option value="code">Code</option>
                  <option value="punctuation">Punctuation</option>
                  <option value="custom">Custom text</option>
                </select>
              </div>
            </div>

            {/* Custom Text Input */}
            {contentType === "custom" && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Enter your text</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste or type your custom text here..."
                  className="w-full p-3 border border-border rounded-md bg-ivory-light min-h-[100px] resize-y"
                  rows={4}
                />
              </div>
            )}

            {/* Options */}
            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm font-medium mb-3">Include in text</label>
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.numbers}
                    onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Numbers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.symbols}
                    onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Symbols (@#$%^&*)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.punctuation}
                    onChange={(e) => setOptions({ ...options, punctuation: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Punctuation (,.!?;:)</span>
                </label>
              </div>

              <label className="block text-sm font-medium mb-3">Game Mode</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.blindMode}
                    onChange={(e) => setOptions({ ...options, blindMode: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Blind Mode (hide text while typing)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.instantDeath}
                    onChange={(e) => setOptions({ ...options, instantDeath: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Instant Death (fail on first error)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.soundEnabled}
                    onChange={(e) => setOptions({ ...options, soundEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Sound Effects</span>
                </label>
              </div>
            </div>
            <Button onClick={handleStart} className="mt-6 w-full">
              Start Test
            </Button>
          </CardContent>
        </Card>

        {selectedText && (
          <TypingEngine
            text={selectedText}
            onComplete={handleComplete}
            timeLimit={mode === "time" ? duration : undefined}
            wordLimit={mode === "words" ? wordCount : undefined}
            blindMode={options.blindMode}
            instantDeath={options.instantDeath}
            soundEnabled={options.soundEnabled}
          />
        )}
      </div>
    </div>
  );
}
