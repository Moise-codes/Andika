import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { TypingService } from './typing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('typing')
@UseGuards(JwtAuthGuard)
export class TypingController {
  constructor(private readonly typingService: TypingService) {}

  @Post('sessions')
  async createSession(@CurrentUser() user: any, @Body() createDto: any) {
    return this.typingService.createSession(user.id, createDto);
  }

  @Get('sessions')
  async getSessions(@CurrentUser() user: any) {
    return this.typingService.getSessions(user.id);
  }

  @Get('sessions/recent')
  async getRecentSessions(@CurrentUser() user: any) {
    return this.typingService.getRecentSessions(user.id, 10);
  }

  @Post('sessions/:id/complete')
  async completeSession(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() resultDto: any,
  ) {
    return this.typingService.completeSession(user.id, id, resultDto);
  }

  @Get('results/:id')
  async getResult(@Param('id') id: string) {
    return this.typingService.getResult(id);
  }

  @Get('results/:id/analysis')
  async getResultAnalysis(@Param('id') id: string) {
    return this.typingService.getResultAnalysis(id);
  }
}
