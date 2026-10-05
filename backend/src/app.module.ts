import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypingModule } from './modules/typing/typing.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { PracticeModule } from './modules/practice/practice.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { ContentModule } from './modules/content/content.module';
import { CompetitionModule } from './modules/competition/competition.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    TypingModule,
    AnalyticsModule,
    CoursesModule,
    LessonsModule,
    PracticeModule,
    AchievementsModule,
    StreaksModule,
    LeaderboardModule,
    ContentModule,
    CompetitionModule,
  ],
})
export class AppModule {}
