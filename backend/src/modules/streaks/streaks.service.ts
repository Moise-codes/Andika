import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  async getStreak(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: { streak: true },
    });

    if (!profile.streak) {
      // Create streak if it doesn't exist
      return this.prisma.streak.create({
        data: {
          profile_id: profile.id,
          current_streak: 0,
          longest_streak: 0,
        },
      });
    }

    return profile.streak;
  }

  async updateStreak(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: { streak: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPractice = profile.streak?.last_practice
      ? new Date(profile.streak.last_practice)
      : null;

    if (lastPractice) {
      lastPractice.setHours(0, 0, 0, 0);
    }

    const daysSinceLastPractice = lastPractice
      ? Math.floor((today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24))
      : 1;

    let newCurrentStreak = profile.streak?.current_streak || 0;
    let newLongestStreak = profile.streak?.longest_streak || 0;

    if (daysSinceLastPractice === 0) {
      // Already practiced today, no change
      return profile.streak;
    } else if (daysSinceLastPractice === 1) {
      // Consecutive day
      newCurrentStreak += 1;
      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
    } else {
      // Streak broken
      newCurrentStreak = 1;
    }

    return this.prisma.streak.update({
      where: { id: profile.streak.id },
      data: {
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_practice: new Date(),
      },
    });
  }
}
