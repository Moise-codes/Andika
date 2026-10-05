import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('streaks')
@UseGuards(JwtAuthGuard)
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  async getStreak(@CurrentUser() user: any) {
    return this.streaksService.getStreak(user.id);
  }

  @Post('update')
  async updateStreak(@CurrentUser() user: any) {
    return this.streaksService.updateStreak(user.id);
  }
}
