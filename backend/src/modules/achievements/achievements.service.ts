import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.achievement.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async getUserAchievements(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { profile_id: profile.id },
      include: { achievement: true },
      orderBy: { unlocked_at: 'desc' },
    });

    return userAchievements;
  }

  async checkAndAwardAchievements(userId: string, sessionData: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: { achievements: true },
    });

    const allAchievements = await this.prisma.achievement.findMany();
    const newAchievements = [];

    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (profile.achievements.some(ua => ua.achievement_id === achievement.id)) {
        continue;
      }

      // Check achievement conditions
      if (await this.checkAchievementCondition(achievement, profile, sessionData)) {
        await this.prisma.userAchievement.create({
          data: {
            profile_id: profile.id,
            achievement_id: achievement.id,
          },
        });
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  private async checkAchievementCondition(achievement: any, profile: any, sessionData: any): Promise<boolean> {
    const sessions = await this.prisma.typingSession.findMany({
      where: { profile_id: profile.id, validated: true },
    });

    switch (achievement.id) {
      case 'first_test':
        return sessions.length >= 1;
      case '1000_chars':
        const totalChars = sessions.reduce((sum, s) => sum + s.correct_chars + s.incorrect_chars, 0);
        return totalChars >= 1000;
      case '7_day_streak':
        const streak = await this.prisma.streak.findUnique({
          where: { profile_id: profile.id },
        });
        return streak?.current_streak >= 7;
      case '100_wpm':
        return sessions.some(s => s.wpm >= 100);
      case '99_accuracy':
        return sessions.some(s => s.accuracy >= 99);
      default:
        return false;
    }
  }
}
