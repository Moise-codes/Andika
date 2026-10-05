import { Controller, Get, Query } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('typing')
  async getTypingContent(
    @Query('type') type?: string,
    @Query('language') language?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.contentService.getTypingContent(type, language, difficulty);
  }

  @Get('programming')
  async getProgrammingContent(
    @Query('language') language?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.contentService.getProgrammingContent(language, difficulty);
  }
}
