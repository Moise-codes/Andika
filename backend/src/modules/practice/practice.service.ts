import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PracticeService {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, createDto: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.practiceSession.create({
      data: {
        profile_id: profile.id,
        mode: createDto.mode,
        duration: createDto.duration,
        wpm: createDto.wpm,
        accuracy: createDto.accuracy,
      },
    });
  }

  async getSessions(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.practiceSession.findMany({
      where: { profile_id: profile.id },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async getRecommendations(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    // Get recent typing sessions to analyze weak keys
    const sessions = await this.prisma.typingSession.findMany({
      where: { profile_id: profile.id, validated: true },
      include: { key_metrics: true },
      take: 20,
      orderBy: { created_at: 'desc' },
    });

    // Calculate weak keys
    const keyStats = new Map<string, { correct: number; incorrect: number }>();
    
    sessions.forEach(session => {
      session.key_metrics.forEach(metric => {
        const existing = keyStats.get(metric.key) || { correct: 0, incorrect: 0 };
        keyStats.set(metric.key, {
          correct: existing.correct + metric.correct,
          incorrect: existing.incorrect + metric.incorrect,
        });
      });
    });

    const weakKeys = Array.from(keyStats.entries())
      .map(([key, stats]) => ({
        key,
        errorRate: stats.incorrect / (stats.correct + stats.incorrect),
      }))
      .filter(k => k.errorRate > 0.3)
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5);

    return {
      weakKeys,
      recommendedModes: ['weak_keys', 'accuracy'],
      suggestedDuration: 300, // 5 minutes
    };
  }
}
