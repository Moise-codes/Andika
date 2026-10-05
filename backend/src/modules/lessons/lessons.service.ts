import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        exercises: true,
      },
    });
  }

  async getProgress(userId: string, lessonId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.lessonProgress.findUnique({
      where: {
        profile_id_lesson_id: {
          profile_id: profile.id,
          lesson_id: lessonId,
        },
      },
    });
  }

  async updateProgress(userId: string, lessonId: string, progressDto: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    const existing = await this.prisma.lessonProgress.findUnique({
      where: {
        profile_id_lesson_id: {
          profile_id: profile.id,
          lesson_id: lessonId,
        },
      },
    });

    if (existing) {
      return this.prisma.lessonProgress.update({
        where: { id: existing.id },
        data: {
          completed: progressDto.completed || existing.completed,
          attempts: existing.attempts + 1,
          best_accuracy: Math.max(existing.best_accuracy || 0, progressDto.accuracy || 0),
          best_wpm: Math.max(existing.best_wpm || 0, progressDto.wpm || 0),
          time_spent: existing.time_spent + (progressDto.timeSpent || 0),
          completed_at: progressDto.completed ? new Date() : existing.completed_at,
        },
      });
    }

    return this.prisma.lessonProgress.create({
      data: {
        profile_id: profile.id,
        lesson_id: lessonId,
        completed: progressDto.completed || false,
        attempts: 1,
        best_accuracy: progressDto.accuracy || 0,
        best_wpm: progressDto.wpm || 0,
        time_spent: progressDto.timeSpent || 0,
        completed_at: progressDto.completed ? new Date() : null,
      },
    });
  }
}
