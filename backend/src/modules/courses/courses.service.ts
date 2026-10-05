import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findPublished() {
    return this.prisma.course.findMany({
      where: { published: true },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async findModules(courseId: string) {
    return this.prisma.module.findMany({
      where: { course_id: courseId },
      include: {
        lessons: true,
      },
      orderBy: { order: 'asc' },
    });
  }
}
