'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppNavigation from "@/components/domain/AppNavigation";
import { Button } from "@/components/ui/button";
import { Users, Timer, Target, Flame, Play, Crown } from "lucide-react";
import { io, Socket } from 'socket.io-client';
import { apiGet, apiPost, getApiOrigin, getAuthToken } from '@/lib/api-client';

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

export default function CompetitionPage() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

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
  ];

  useEffect(() => {
    let newSocket: Socket | null = null;
    let cancelled = false;

    const connect = async () => {
      const token = await getAuthToken();
      if (cancelled) return;

      const socketUrl = getApiOrigin();
      newSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to competition server');
      });

      newSocket.on('participant-joined', (data: any) => {
        setParticipants(prev => [...prev, data]);
      });

      newSocket?.on('participant-left', (data: any) => {
        setParticipants(prev => prev.filter(p => p.userId !== data.userId));
      });

      newSocket?.on('competition-started', (data: any) => {
        setIsStarted(true);
        setTimeLeft(data.duration);
        generateWords();
        inputRef.current?.focus();
      });

      newSocket?.on('progress-update', (data: any) => {
        setParticipants(prev => prev.map(p =>
          p.userId === data.userId ? { ...p, progress: data.progress, wpm: data.wpm, accuracy: data.accuracy } : p
        ));
      });

      newSocket?.on('participant-finished', (data: any) => {
        setParticipants(prev => prev.map(p =>
          p.userId === data.userId ? { ...p, finished: true, wpm: data.wpm, accuracy: data.accuracy } : p
        ));
      });

      newSocket?.on('competition-ended', (data: any) => {
        setIsFinished(true);
        setIsStarted(false);
        setResults(data.results);
      });

      newSocket?.on('error', (data: any) => {
        console.error('Competition error:', data.message);
      });

      setSocket(newSocket);
    };

    connect();

    return () => {
      cancelled = true;
      newSocket?.disconnect();
    };
  }, []);

  const generateWords = () => {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 50);
    setWords(selected);
    setCurrentWordIndex(0);
    setCurrentInput('');
  };

  const joinCompetition = async () => {
    try {
      const res = await apiGet('/auth/me');

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) return;

      const profile = await res.json();
      if (!profile) return;

      const newRoomId = roomId || `room-${Date.now()}`;
      setUserId(profile.user_id);
      socket?.emit('join-competition', {
        roomId: newRoomId,
        userId: profile.user_id,
        username: profile.username,
      });
      setRoomId(newRoomId);
      setIsJoined(true);
    } catch (error) {
      console.error('Failed to join competition:', error);
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

    if (value.endsWith(' ')) {
      const trimmedValue = value.trim();
      const wordCorrect = trimmedValue === currentWord;

      setTotalChars(prev => prev + currentWord.length + 1);
      setCorrectChars(prev => prev + (wordCorrect ? currentWord.length : 0));

      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentInput('');
      } else {
        finishCompetition();
      }
    }

    // Update progress
    const progress = ((currentWordIndex + (value.length > 0 ? 1 : 0)) / words.length) * 100;
    const timeElapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
    const calculatedWpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
    const calculatedAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    socket?.emit('update-progress', {
      roomId,
      userId,
      progress,
      wpm: calculatedWpm,
      accuracy: calculatedAccuracy,
    });
  };

  const finishCompetition = async () => {
    socket?.emit('finish-competition', {
      roomId,
      userId,
      wpm,
      accuracy,
    });

    // Save result to backend
    try {
      await apiPost('/typing/sessions', {
        mode: 'time',
        duration: 60 - timeLeft,
        wordCount: words.length,
        contentType: 'competition',
        wpm: wpm,
        accuracy: accuracy,
        correctChars: correctChars,
        incorrectChars: totalChars - correctChars,
        timeElapsed: startTime ? (Date.now() - startTime) / 1000 : 0,
        errors: [],
        keyMetrics: [],
      });
    } catch (error) {
      console.error('Failed to save competition session:', error);
    }
  };

  const leaveCompetition = () => {
    socket?.emit('leave-competition', { roomId });
    setIsJoined(false);
    setIsStarted(false);
    setIsFinished(false);
    setParticipants([]);
    setResults([]);
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
        <AppNavigation />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: T.ink }}>Competition</h1>
            <p className="text-sm" style={{ color: T.body }}>Compete against other typists in real-time</p>
          </div>

          <div className="rounded-2xl border p-8" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: T.ink }}>
                Room ID (optional)
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID or leave empty to create new room"
                className="w-full p-3 rounded-xl border-2 bg-transparent outline-none"
                style={{ borderColor: T.border, color: T.ink }}
              />
            </div>

            <Button
              onClick={joinCompetition}
              className="w-full btn-andika-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Join Competition
            </Button>

            <div className="mt-6 text-center text-sm" style={{ color: T.body }}>
              <Users className="w-5 h-5 mx-auto mb-2" style={{ color: T.accent }} />
              <p>Wait for 4 participants to start</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isStarted && !isFinished) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
        <AppNavigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: T.ink }}>Competition</h1>
            <Button onClick={leaveCompetition} variant="outline">Leave</Button>
          </div>

          <div className="rounded-2xl border p-8" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="text-center mb-8">
              <Users className="w-16 h-16 mx-auto mb-4" style={{ color: T.accent }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: T.ink }}>
                Waiting for participants...
              </h2>
              <p className="text-sm" style={{ color: T.body }}>
                {participants.length}/4 players joined
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {participants.map((p, i) => (
                <div key={p.userId} className="p-4 rounded-xl" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="font-semibold" style={{ color: T.ink }}>{p.username}</div>
                  <div className="text-sm" style={{ color: T.body }}>Player {i + 1}</div>
                </div>
              ))}
              {[...Array(4 - participants.length)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl opacity-50" style={{ backgroundColor: T.surfaceWarm }}>
                  <div className="font-semibold" style={{ color: T.body }}>Waiting...</div>
                  <div className="text-sm" style={{ color: T.body }}>Player {participants.length + i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
        <AppNavigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: T.ink }}>Competition Results</h1>
            <Button onClick={leaveCompetition}>Leave</Button>
          </div>

          <div className="rounded-2xl border p-8" style={{ backgroundColor: T.surface, borderColor: T.border }}>
            <div className="space-y-4">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    i === 0 ? 'border-2' : ''
                  }`}
                  style={{
                    backgroundColor: T.surfaceWarm,
                    borderColor: i === 0 ? T.accent : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-4">
                    {i === 0 && <Crown className="w-6 h-6" style={{ color: T.accent }} />}
                    <div>
                      <div className="font-semibold" style={{ color: T.ink }}>{r.username}</div>
                      <div className="text-sm" style={{ color: T.body }}>
                        {i === 0 ? 'Winner!' : `#${i + 1}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: T.accent }}>{r.wpm} WPM</div>
                    <div className="text-sm" style={{ color: T.body }}>{Math.round(r.accuracy)}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={leaveCompetition}
              className="w-full mt-8 btn-andika-primary text-white font-semibold py-3 rounded-xl"
            >
              Back to Lobby
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.bg }}>
      <AppNavigation />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" style={{ color: T.accent }} />
              <span className="text-2xl font-bold" style={{ color: T.ink }}>
                {timeLeft}s
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
            </div>
          </div>
          <Button onClick={leaveCompetition} variant="outline">Leave</Button>
        </div>

        {/* Participants Progress */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {participants.map((p, i) => (
            <div
              key={p.userId}
              className="p-4 rounded-xl"
              style={{ backgroundColor: T.surface, borderColor: T.border }}
            >
              <div className="font-semibold mb-2" style={{ color: T.ink }}>{p.username}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${p.progress || 0}%`, backgroundColor: T.accent }}
                />
              </div>
              <div className="flex justify-between text-sm" style={{ color: T.body }}>
                <span>{p.wpm || 0} WPM</span>
                <span>{Math.round(p.accuracy || 0)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Typing Area */}
        <div className="rounded-2xl border p-8" style={{ backgroundColor: T.surface, borderColor: T.border }}>
          <div className="text-2xl leading-relaxed mb-6 font-medium" style={{ color: T.ink }}>
            {words.map((word, index) => {
              const isCurrentWord = index === currentWordIndex;
              return (
                <span
                  key={index}
                  className={`inline-block mr-3 ${isCurrentWord ? 'underline' : ''}`}
                  style={{ color: isCurrentWord ? T.accent : T.ink }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            disabled={isFinished}
            className="w-full text-xl p-4 rounded-xl border-2 bg-transparent outline-none"
            style={{ borderColor: T.border, color: T.ink }}
            placeholder="Start typing..."
            autoFocus
          />
        </div>
      </main>
    </div>
  );
}
