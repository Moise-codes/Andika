import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getGlobal(limit: number) {
    const profiles = await this.prisma.profile.findMany({
      where: { leaderboard_visibility: true },
      include: {
        typing_sessions: {
          where: { validated: true },
          orderBy: { wpm: 'desc' },
          take: 1,
        },
      },
      take: limit,
    });

    return profiles
      .map(p => ({
        username: p.username,
        country: p.country,
        bestWpm: p.typing_sessions[0]?.wpm || 0,
        bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
      }))
      .sort((a, b) => b.bestWpm - a.bestWpm);
  }

  async getByCountry(country: string, limit: number) {
    const profiles = await this.prisma.profile.findMany({
      where: { 
        leaderboard_visibility: true,
        country: country.toUpperCase(),
      },
      include: {
        typing_sessions: {
          where: { validated: true },
          orderBy: { wpm: 'desc' },
          take: 1,
        },
      },
      take: limit,
    });

    return profiles
      .map(p => ({
        username: p.username,
        country: p.country,
        bestWpm: p.typing_sessions[0]?.wpm || 0,
        bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
      }))
      .sort((a, b) => b.bestWpm - a.bestWpm);
  }

  async getWeekly(limit: number) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const profiles = await this.prisma.profile.findMany({
      where: { leaderboard_visibility: true },
      include: {
        typing_sessions: {
          where: { 
            validated: true,
            created_at: { gte: oneWeekAgo },
          },
          orderBy: { wpm: 'desc' },
          take: 1,
        },
      },
      take: limit,
    });

    return profiles
      .map(p => ({
        username: p.username,
        country: p.country,
        bestWpm: p.typing_sessions[0]?.wpm || 0,
        bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
      }))
      .sort((a, b) => b.bestWpm - a.bestWpm);
  }

  async getMonthly(limit: number) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const profiles = await this.prisma.profile.findMany({
      where: { leaderboard_visibility: true },
      include: {
        typing_sessions: {
          where: { 
            validated: true,
            created_at: { gte: oneMonthAgo },
          },
          orderBy: { wpm: 'desc' },
          take: 1,
        },
      },
      take: limit,
    });

    return profiles
      .map(p => ({
        username: p.username,
        country: p.country,
        bestWpm: p.typing_sessions[0]?.wpm || 0,
        bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
      }))
      .sort((a, b) => b.bestWpm - a.bestWpm);
  }

  async getAllTime(limit: number) {
    return this.getGlobal(limit);
  }
}
