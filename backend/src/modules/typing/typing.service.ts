import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TypingService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, createDto: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    // Validate result (server-side validation)
    const validatedWPM = this.validateWPM(createDto);
    const validatedAccuracy = this.validateAccuracy(createDto);

    // Map error fields from frontend format to database format
    const errorData = createDto.errors?.map((err: any) => ({
      index: err.index,
      expected_char: err.expected,
      actual_char: err.actual,
    })) || [];

    return this.prisma.typingSession.create({
      data: {
        profile_id: profile.id,
        mode: createDto.mode,
        duration: createDto.duration,
        word_count: createDto.wordCount,
        content_type: createDto.contentType,
        wpm: validatedWPM || createDto.wpm || 0,
        accuracy: validatedAccuracy || createDto.accuracy || 0,
        correct_chars: createDto.correctChars || 0,
        incorrect_chars: createDto.incorrectChars || 0,
        backspaces: createDto.backspaces || 0,
        time_elapsed: createDto.timeElapsed || 0,
        validated: true,
        errors: errorData.length > 0 ? {
          create: errorData,
        } : undefined,
        key_metrics: createDto.keyMetrics ? {
          create: createDto.keyMetrics,
        } : undefined,
      },
    });
  }

  async getSessions(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.typingSession.findMany({
      where: { profile_id: profile.id },
      orderBy: { created_at: 'desc' },
    });
  }

  async getRecentSessions(userId: string, limit: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.typingSession.findMany({
      where: { profile_id: profile.id },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async completeSession(userId: string, sessionId: string, resultDto: any) {
    // Validate result (server-side validation)
    const validatedWPM = this.validateWPM(resultDto);
    const validatedAccuracy = this.validateAccuracy(resultDto);

    return this.prisma.typingSession.update({
      where: { id: sessionId },
      data: {
        wpm: validatedWPM,
        accuracy: validatedAccuracy,
        consistency: resultDto.consistency,
        correct_chars: resultDto.correctChars,
        incorrect_chars: resultDto.incorrectChars,
        backspaces: resultDto.backspaces,
        time_elapsed: resultDto.timeElapsed,
        validated: true,
        errors: {
          create: resultDto.errors,
        },
        key_metrics: {
          create: resultDto.keyMetrics,
        },
      },
    });
  }

  async getResult(sessionId: string) {
    return this.prisma.typingSession.findUnique({
      where: { id: sessionId },
      include: {
        errors: true,
        key_metrics: true,
      },
    });
  }

  async getResultAnalysis(sessionId: string) {
    const session = await this.getResult(sessionId);

    // Calculate additional analysis
    const weakKeys = this.calculateWeakKeys(session.key_metrics);
    const slowTransitions = this.calculateSlowTransitions(session.errors);

    return {
      session,
      analysis: {
        weakKeys,
        slowTransitions,
      },
    };
  }

  private validateWPM(result: any): number {
    // Server-side WPM validation: (correct characters / 5) / minutes
    const timeElapsedMinutes = result.timeElapsed / 60;
    if (timeElapsedMinutes <= 0) return 0;

    const calculatedWPM = (result.correctChars / 5) / timeElapsedMinutes;

    // Sanity checks
    if (calculatedWPM < 0 || calculatedWPM > 300) {
      throw new Error('Invalid WPM calculation');
    }

    // Allow small margin for client-server timing differences
    if (Math.abs(calculatedWPM - result.wpm) > 10) {
      return Math.round(calculatedWPM);
    }
    return result.wpm;
  }

  private validateAccuracy(result: any): number {
    const totalChars = result.correctChars + result.incorrectChars;
    if (totalChars === 0) return 100;

    const calculatedAccuracy = (result.correctChars / totalChars) * 100;

    // Sanity check
    if (calculatedAccuracy < 0 || calculatedAccuracy > 100) {
      throw new Error('Invalid accuracy calculation');
    }

    return Math.round(calculatedAccuracy);
  }

  private calculateWeakKeys(keyMetrics: any[]): any[] {
    return keyMetrics
      .filter(k => k.incorrect > k.correct)
      .sort((a, b) => b.incorrect - a.incorrect)
      .slice(0, 5);
  }

  private calculateSlowTransitions(errors: any[]): any[] {
    // Simplified transition analysis
    return errors.slice(0, 10);
  }
}
