import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateWPM(characters: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  return Math.round((characters / 5) / (timeInSeconds / 60));
}

export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

export function calculateConsistency(wpmHistory: number[]): number {
  if (wpmHistory.length < 2) return 100;
  const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
  const variance = wpmHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmHistory.length;
  const stdDev = Math.sqrt(variance);
  return Math.round(Math.max(0, 100 - (stdDev / mean) * 100));
}
