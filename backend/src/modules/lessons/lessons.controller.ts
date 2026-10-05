import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Get(':id/progress')
  async getProgress(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lessonsService.getProgress(user.id, id);
  }

  @Post(':id/progress')
  async updateProgress(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() progressDto: any,
  ) {
    return this.lessonsService.updateProgress(user.id, id, progressDto);
  }
}
