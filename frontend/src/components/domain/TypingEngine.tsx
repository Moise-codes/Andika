"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { calculateWPM, calculateAccuracy } from "@/lib/utils";

// Sound effects using Web Audio API
const playKeystrokeSound = (soundType: string, volume: number) => {
  if (typeof window === 'undefined') return;

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const normalizedVolume = volume / 100;
    gainNode.gain.setValueAtTime(normalizedVolume * 0.1, audioContext.currentTime);

    switch (soundType) {
      case 'mechanical':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.05);
        break;
      case 'soft':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.03);
        break;
      case 'typewriter':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.04);
        break;
      case 'minimal':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        break;
      default:
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

interface TypingEngineProps {
  text: string;
  onComplete?: (result: TypingResult) => void;
  timeLimit?: number; // seconds
  wordLimit?: number;
  blindMode?: boolean;
  instantDeath?: boolean;
  soundEnabled?: boolean;
}

export interface TypingResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
  errors: TypingError[];
  keyMetrics: KeyMetric[];
}

export interface TypingError {
  index: number;
  expected: string;
  actual: string;
}

export interface KeyMetric {
  key: string;
  correct: number;
  incorrect: number;
  avgTime: number;
}

export default function TypingEngine({ text, onComplete, timeLimit, wordLimit, blindMode = false, instantDeath = false, soundEnabled = true }: TypingEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState<TypingError[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [keyMetrics, setKeyMetrics] = useState<Record<string, KeyMetric>>({});
  const [lastKeyPressTime, setLastKeyPressTime] = useState<number>(0);
  const [instantDeathFailed, setInstantDeathFailed] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (startTime && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((Date.now() - startTime) / 1000);

        // Check time limit
        if (timeLimit && (Date.now() - startTime) / 1000 >= timeLimit) {
          completeTest();
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isComplete, timeLimit]);

  const completeTest = useCallback(() => {
    if (isComplete) return;

    setIsComplete(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const correctChars = input.split("").filter((char, i) => char === text[i]).length;
    const incorrectChars = errors.length;
    const totalChars = input.length;

    const result: TypingResult = {
      wpm: calculateWPM(correctChars, timeElapsed),
      accuracy: calculateAccuracy(correctChars, totalChars),
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed,
      errors,
      keyMetrics: Object.values(keyMetrics),
    };

    onComplete?.(result);
  }, [input, text, errors, timeElapsed, keyMetrics, isComplete, onComplete]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComplete) return;

    // Ignore modifier keys
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (!startTime) {
      setStartTime(Date.now());
      setLastKeyPressTime(Date.now());
    }

    const keyTime = Date.now() - lastKeyPressTime;
    setLastKeyPressTime(Date.now());

    // Play sound if enabled
    if (soundEnabled) {
      playKeystrokeSound('mechanical', 50);
    }

    // Track key metrics
    const key = e.key.toLowerCase();
    setKeyMetrics(prev => {
      const existing = prev[key] || { key, correct: 0, incorrect: 0, avgTime: 0 };
      const isCorrect = key === text[currentIndex]?.toLowerCase();
      const newCorrect = isCorrect ? existing.correct + 1 : existing.correct;
      const newIncorrect = isCorrect ? existing.incorrect : existing.incorrect + 1;
      const newAvgTime = ((existing.avgTime * (existing.correct + existing.incorrect)) + keyTime) / (newCorrect + newIncorrect);

      return {
        ...prev,
        [key]: { key, correct: newCorrect, incorrect: newIncorrect, avgTime: newAvgTime }
      };
    });
  }, [currentIndex, text, startTime, isComplete, lastKeyPressTime, soundEnabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComplete || instantDeathFailed) return;

    const newValue = e.target.value;
    const newChar = newValue[newValue.length - 1];
    const expectedChar = text[currentIndex];

    if (newChar !== expectedChar) {
      setErrors(prev => [...prev, { index: currentIndex, expected: expectedChar, actual: newChar }]);

      // Instant death mode - fail on first error
      if (instantDeath) {
        setInstantDeathFailed(true);
        completeTest();
        return;
      }
    }

    setInput(newValue);
    setCurrentIndex(newValue.length);

    // Check word limit
    if (wordLimit && newValue.split(" ").length >= wordLimit) {
      completeTest();
    }

    // Check completion
    if (newValue.length >= text.length) {
      completeTest();
    }
  }, [currentIndex, text, isComplete, wordLimit, completeTest, instantDeath, instantDeathFailed]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setInput("");
    setErrors([]);
    setStartTime(null);
    setTimeElapsed(0);
    setIsComplete(false);
    setKeyMetrics({});
    setLastKeyPressTime(0);
    setInstantDeathFailed(false);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }, []);

  const currentWPM = startTime ? calculateWPM(
    input.split("").filter((char, i) => char === text[i]).length,
    timeElapsed
  ) : 0;
  const correctCharsSoFar = input.split("").filter((char, i) => char === text[i]).length;
  const currentAccuracy = input.length > 0 ? calculateAccuracy(correctCharsSoFar, input.length) : 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-6 text-lg">
        <div className="flex gap-6">
          <div>
            <span className="text-text-secondary">WPM: </span>
            <span className="font-bold text-forest-primary">{currentWPM}</span>
          </div>
          <div>
            <span className="text-text-secondary">Accuracy: </span>
            <span className="font-bold text-forest-primary">{currentAccuracy}%</span>
          </div>
          <div>
            <span className="text-text-secondary">Time: </span>
            <span className="font-bold text-forest-primary">{Math.floor(timeElapsed)}s</span>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-forest-primary text-ivory-light rounded-md hover:bg-forest-dark transition-colors"
        >
          Restart
        </button>
      </div>

      {/* Text Display */}
      <div
        className="bg-ivory-medium rounded-lg p-6 mb-6 border border-border cursor-pointer relative overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="font-mono text-xl leading-relaxed break-words">
          {text.split("").map((char, index) => {
            let charClass = "text-text-primary";

            // Blind mode: hide typed characters
            if (blindMode && index < currentIndex) {
              charClass = "text-text-primary opacity-30";
            } else if (index < currentIndex) {
              charClass = input[index] === char ? "text-forest-primary" : "text-red-600 line-through";
            } else if (index === currentIndex) {
              charClass = "bg-forest-primary text-ivory-light";
            }
            return (
              <span key={index} className={charClass}>
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute"
        autoFocus
        disabled={isComplete}
      />

      {/* Instructions */}
      <div className="text-center text-text-secondary">
        {isComplete ? (
          <p className="text-forest-primary font-semibold">Test complete! Scroll down to see results.</p>
        ) : (
          <p className="cursor-pointer hover:text-forest-primary transition-colors" onClick={() => inputRef.current?.focus()}>
            Click the text above and start typing...
          </p>
        )}
      </div>
    </div>
  );
}
