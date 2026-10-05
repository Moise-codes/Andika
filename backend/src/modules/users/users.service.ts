import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: {
        typing_settings: true,
        streak: true,
      },
    });
    return profile;
  }

  async updateProfile(userId: string, updateDto: any) {
    return this.prisma.profile.update({
      where: { user_id: userId },
      data: updateDto,
    });
  }

  async getSettings(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
      include: { typing_settings: true },
    });
    return profile.typing_settings;
  }

  async updateSettings(userId: string, settingsDto: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });

    return this.prisma.typingSettings.update({
      where: { profile_id: profile.id },
      data: settingsDto,
    });
  }
}
