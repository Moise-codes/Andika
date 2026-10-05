import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboards')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('global')
  async getGlobal(@Query('limit') limit?: string) {
    return this.leaderboardService.getGlobal(limit ? parseInt(limit) : 100);
  }

  @Get('country')
  async getByCountry(@Query('country') country: string, @Query('limit') limit?: string) {
    return this.leaderboardService.getByCountry(country, limit ? parseInt(limit) : 100);
  }

  @Get('weekly')
  async getWeekly(@Query('limit') limit?: string) {
    return this.leaderboardService.getWeekly(limit ? parseInt(limit) : 100);
  }

  @Get('monthly')
  async getMonthly(@Query('limit') limit?: string) {
    return this.leaderboardService.getMonthly(limit ? parseInt(limit) : 100);
  }

  @Get('all-time')
  async getAllTime(@Query('limit') limit?: string) {
    return this.leaderboardService.getAllTime(limit ? parseInt(limit) : 100);
  }
}
