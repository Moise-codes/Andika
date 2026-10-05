import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getTypingContent(type?: string, language?: string, difficulty?: string) {
    const where: any = {};
    
    if (type) where.type = type;
    if (language) where.language = language;
    if (difficulty) where.difficulty = difficulty;

    return this.prisma.typingContent.findMany({
      where,
      take: 50,
      orderBy: { created_at: 'desc' },
    });
  }

  async getProgrammingContent(language?: string, difficulty?: string) {
    const where: any = {};
    
    if (language) where.language = language;
    if (difficulty) where.difficulty = difficulty;

    return this.prisma.programmingContent.findMany({
      where,
      take: 50,
      orderBy: { created_at: 'desc' },
    });
  }
}
