import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('practice')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post('sessions')
  async createSession(@CurrentUser() user: any, @Body() createDto: any) {
    return this.practiceService.createSession(user.id, createDto);
  }

  @Get('sessions')
  async getSessions(@CurrentUser() user: any) {
    return this.practiceService.getSessions(user.id);
  }

  @Get('recommendations')
  async getRecommendations(@CurrentUser() user: any) {
    return this.practiceService.getRecommendations(user.id);
  }
}
