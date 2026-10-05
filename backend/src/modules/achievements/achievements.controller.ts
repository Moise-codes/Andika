import { Controller, Get, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async findAll() {
    return this.achievementsService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserAchievements(@CurrentUser() user: any) {
    return this.achievementsService.getUserAchievements(user.id);
  }
}
