import { Controller, Get, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('published')
  async findPublished() {
    return this.coursesService.findPublished();
  }

  @Get(':id')
  async findOne(id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/modules')
  async findModules(id: string) {
    return this.coursesService.findModules(id);
  }
}
