import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@CurrentUser() user: any) {
    return this.analyticsService.getOverview(user.id);
  }

  @Get('performance')
  async getPerformance(
    @CurrentUser() user: any,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getPerformance(user.id, days ? parseInt(days) : 30);
  }

  @Get('weak-keys')
  async getWeakKeys(@CurrentUser() user: any) {
    return this.analyticsService.getWeakKeys(user.id);
  }

  @Get('transitions')
  async getTransitions(@CurrentUser() user: any) {
    return this.analyticsService.getTransitions(user.id);
  }
}
