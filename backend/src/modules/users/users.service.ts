import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

/** Fields a user may change on their own profile. */
const PROFILE_FIELDS = [
  'username',
  'avatar_url',
  'country',
  'timezone',
  'public_profile',
  'leaderboard_visibility',
  'country_visibility',
  'statistics_visibility',
] as const;

/** Fields a user may change on their typing settings. */
const SETTINGS_FIELDS = [
  'keyboard_layout',
  'theme',
  'sound_enabled',
  'sound_type',
  'sound_volume',
  'caret_style',
  'caret_behavior',
  'show_keyboard',
] as const;

type ProfileField = (typeof PROFILE_FIELDS)[number];
type SettingsField = (typeof SETTINGS_FIELDS)[number];

function pick<T extends string>(
  source: Record<string, unknown> | undefined,
  allowed: readonly T[],
): Partial<Record<T, unknown>> {
  const result: Partial<Record<T, unknown>> = {};
  if (!source) return result;

  for (const key of allowed) {
    if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: {
        typing_settings: true,
        streak: true,
      },
    });
  }

  async updateProfile(userId: string, updateDto: Record<string, unknown>) {
    const data = pick<ProfileField>(updateDto, PROFILE_FIELDS) as Prisma.ProfileUpdateInput;

    return this.prisma.profile.update({
      where: { user_id: userId },
      data,
    });
  }

  async getSettings(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: { typing_settings: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile.typing_settings;
  }

  async updateSettings(userId: string, settingsDto: Record<string, unknown>) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const data = pick<SettingsField>(
      settingsDto,
      SETTINGS_FIELDS,
    ) as Prisma.TypingSettingsUpdateInput;

    return this.prisma.typingSettings.update({
      where: { profile_id: profile.id },
      data,
    });
  }

  async getStats(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: {
        typing_sessions: {
          where: { validated: true },
          orderBy: { created_at: 'desc' },
        },
        streak: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const sessions = profile.typing_sessions;

    // Calculate stats
    const currentWpm = sessions.length > 0 ? sessions[0].wpm : 0;
    const averageWpm = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length
      : 0;
    const averageAccuracy = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
      : 0;
    const totalPracticeTime = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.time_elapsed, 0))
      : 0;

    return {
      username: profile.username,
      current_wpm: currentWpm,
      average_wpm: Math.round(averageWpm),
      average_accuracy: Math.round(averageAccuracy),
      total_practice_time: totalPracticeTime,
      streak: profile.streak ? {
        current_streak: profile.streak.current_streak,
        longest_streak: profile.streak.longest_streak,
      } : null,
    };
  }
}
