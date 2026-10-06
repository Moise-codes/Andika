'use client';

import { useState, useEffect, useRef } from 'react';
import AppNavigation from "@/components/domain/AppNavigation";
import { Button } from "@/components/ui/button";
import { RotateCcw, Timer, Target, Flame } from "lucide-react";
import { apiPost } from '@/lib/api-client';

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

const WORD_LIST = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'world', 'life', 'type', 'fast', 'speed', 'word', 'letter', 'keyboard', 'practice', 'improve',
  'skill', 'learn', 'master', 'typing', 'hands', 'fingers', 'position', 'technique', 'accuracy', 'wpm'
];

export default function PracticePage() {
  const [mode, setMode] = useState<'time' | 'words'>('time');
  const [duration, setDuration] = useState(60);
  const [wordCount, setWordCount] = useState(50);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [consistency, setConsistency] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [typedWords, setTypedWords] = useState<{ word: string; correct: boolean }[]>([]);
  const [keyErrors, setKeyErrors] = useState<Record<string, number>>({});
  const [keyTimings, setKeyTimings] = useState<Record<string, number[]>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [charTimestamps, setCharTimestamps] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateWords();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && !isFinished && mode === 'time' && timeLeft > 0) {
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
  }, [isStarted, isFinished, mode, timeLeft]);

  const generateWords = () => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const count = mode === 'words' ? wordCount : 100;
    const selected = shuffled.slice(0, count);
    setWords(selected);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWords([]);
  };

  const handleModeChange = (newMode: 'time' | 'words') => {
    setMode(newMode);
    restartTest();
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    restartTest();
  };

  const handleWordCountChange = (newCount: number) => {
    setWordCount(newCount);
    restartTest();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      restartTest();
      return;
    }

    if (!isStarted && !isFinished) {
      setIsStarted(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    if (!startTime && isStarted) {
      setStartTime(Date.now());
    }

    const currentWord = words[currentWordIndex];
    const isCorrect = value === currentWord;

    // Track key errors
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      const expectedChar = currentWord[value.length - 1];

      if (lastChar !== expectedChar) {
        setKeyErrors(prev => ({
          ...prev,
          [lastChar]: (prev[lastChar] || 0) + 1
        }));
      }

      // Track key timings
      const now = Date.now();
      setKeyTimings(prev => ({
        ...prev,
        [lastChar]: [...(prev[lastChar] || []), now - (prev[lastChar]?.[prev[lastChar].length - 1] || now)]
      }));

      setCharTimestamps(prev => [...prev, now]);
    }

    if (value.endsWith(' ')) {
      const trimmedValue = value.trim();
      const wordCorrect = trimmedValue === currentWord;

      setTypedWords(prev => [...prev, { word: currentWord, correct: wordCorrect }]);
      setTotalChars(prev => prev + currentWord.length + 1);
      setCorrectChars(prev => prev + (wordCorrect ? currentWord.length : 0));

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentInput('');
      } else {
        finishTest();
      }
    }
  };

  const calculateStats = () => {
    const timeElapsed = mode === 'time'
      ? (duration - timeLeft) / 60
      : startTime ? (Date.now() - startTime) / 60000 : 0;

    const wordsTyped = typedWords.length;
    const correctWords = typedWords.filter(w => w.correct).length;

    // Net WPM: (correct characters / 5) / minutes
    const calculatedWpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;

    // Raw WPM: (total characters / 5) / minutes
    const calculatedRawWpm = timeElapsed > 0 ? Math.round((totalChars / 5) / timeElapsed) : 0;

    // Accuracy: (correct chars / total chars) * 100
    const calculatedAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    // Consistency: standard deviation of character timings
    let calculatedConsistency = 100;
    if (charTimestamps.length > 1) {
      const intervals = [];
      for (let i = 1; i < charTimestamps.length; i++) {
        intervals.push(charTimestamps[i] - charTimestamps[i - 1]);
      }
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      // Lower std deviation = higher consistency
      calculatedConsistency = Math.max(0, Math.min(100, 100 - (stdDev / mean) * 100));
    }

    setWpm(calculatedWpm);
    setRawWpm(calculatedRawWpm);
    setAccuracy(calculatedAccuracy);
    setConsistency(Math.round(calculatedConsistency));
  };

  const finishTest = async () => {
    setIsFinished(true);
    setIsStarted(false);
    calculateStats();

    // Save result to backend
    try {
      await apiPost('/typing/sessions', {
        mode: mode,
        duration: mode === "time" ? duration : (startTime ? (Date.now() - startTime) / 1000 : 0),
        wordCount: mode === "words" ? wordCount : typedWords.length,
        contentType: 'plain',
        wpm: wpm,
        accuracy: accuracy,
        correctChars: correctChars,
        incorrectChars: totalChars - correctChars,
        timeElapsed: mode === "time" ? duration - timeLeft : (startTime ? (Date.now() - startTime) / 1000 : 0),
        errors: Object.entries(keyErrors).map(([key, count]) => ({ key, count })),
        keyMetrics: Object.entries(keyTimings).map(([key, timings]) => ({
          key,
          avgTime: timings.reduce((a, b) => a + b, 0) / timings.length,
          correct: 0,
          incorrect: 0,
        })),
      });
    } catch (error) {
      console.error('Failed to save typing session:', error);
    }
  };

  const restartTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(mode === 'time' ? duration : 0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setConsistency(0);
    setCorrectChars(0);
    setTotalChars(0);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWords([]);
    setKeyErrors({});
    setKeyTimings({});
    setStartTime(null);
    setCharTimestamps([]);
    generateWords();
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
      <AppNavigation />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => handleModeChange('time')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              mode === 'time' ? 'btn-andika-primary text-white' : 'bg-white text-gray-700 border-2'
            }`}
          >
            Time
          </button>
          <button
            onClick={() => handleModeChange('words')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              mode === 'words' ? 'btn-andika-primary text-white' : 'bg-white text-gray-700 border-2'
            }`}
          >
            Words
          </button>
        </div>

        {/* Duration/Word Count Selector */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {mode === 'time' ? (
            <>
              {[15, 30, 60, 120].map(d => (
                <button
                  key={d}
                  onClick={() => handleDurationChange(d)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    duration === d ? 'btn-andika-primary text-white' : 'bg-white text-gray-700 border-2'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </>
          ) : (
            <>
              {[10, 25, 50, 100].map(w => (
                <button
                  key={w}
                  onClick={() => handleWordCountChange(w)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    wordCount === w ? 'btn-andika-primary text-white' : 'bg-white text-gray-700 border-2'
                  }`}
                >
                  {w}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            {mode === 'time' ? (
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" style={{ color: T.accent }} />
                <span className="text-2xl font-bold" style={{ color: T.ink }}>
                  {isFinished ? '0:00' : `0:${timeLeft.toString().padStart(2, '0')}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: T.accent }} />
                <span className="text-2xl font-bold" style={{ color: T.ink }}>
                  {words.length - currentWordIndex}
                </span>
                <span className="text-sm" style={{ color: T.body }}>words left</span>
              </div>
            )}
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
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: T.accent }} />
              <span className="text-2xl font-bold" style={{ color: T.ink }}>{consistency}%</span>
              <span className="text-sm" style={{ color: T.body }}>con</span>
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
              {/* Words Display */}
              <div className="text-2xl leading-relaxed mb-6 font-medium" style={{ color: T.ink }}>
                {words.map((word, index) => {
                  const isCurrentWord = index === currentWordIndex;
                  const isPastWord = index < currentWordIndex;
                  const wordData = typedWords[index];

                  return (
                    <span
                      key={index}
                      className={`inline-block mr-3 transition-all ${
                        isCurrentWord ? 'underline' : ''
                      } ${
                        isPastWord
                          ? wordData?.correct
                            ? 'text-green-600'
                            : 'text-red-500'
                          : ''
                      }`}
                      style={{
                        color: isCurrentWord ? T.accent : isPastWord ? (wordData?.correct ? T.correct : T.error) : T.ink
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isFinished}
                className="w-full text-xl p-4 rounded-xl border-2 bg-transparent outline-none transition-all"
                style={{
                  borderColor: T.border,
                  color: T.ink
                }}
                placeholder={isStarted ? '' : 'Click here and start typing...'}
                autoFocus
              />
            </>
          ) : (
            /* Results */
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold mb-8" style={{ color: T.ink }}>Test Complete!</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <div className="p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: T.accent }}>{wpm}</div>
                  <div className="text-sm" style={{ color: T.body }}>WPM</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: T.accent }}>{rawWpm}</div>
                  <div className="text-sm" style={{ color: T.body }}>Raw WPM</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: T.accent }}>{accuracy}%</div>
                  <div className="text-sm" style={{ color: T.body }}>Accuracy</div>
                </div>
                <div className="p-6 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: T.accent }}>{consistency}%</div>
                  <div className="text-sm" style={{ color: T.body }}>Consistency</div>
                </div>
              </div>

              {/* Detailed Stats */}
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
                    <div className="text-sm" style={{ color: T.body }}>Words</div>
                    <div className="text-xl font-bold" style={{ color: T.ink }}>{typedWords.length}</div>
                  </div>
                </div>

                {/* Weak Keys */}
                {Object.keys(keyErrors).length > 0 && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold mb-2" style={{ color: T.ink }}>Weak Keys</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(keyErrors)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([key, count]) => (
                          <span
                            key={key}
                            className="px-3 py-1 rounded-lg text-sm font-semibold"
                            style={{
                              backgroundColor: T.error,
                              color: 'white'
                            }}
                          >
                            {key.toUpperCase()}: {count}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
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
