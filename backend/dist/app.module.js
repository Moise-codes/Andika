"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const typing_module_1 = require("./modules/typing/typing.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const courses_module_1 = require("./modules/courses/courses.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const practice_module_1 = require("./modules/practice/practice.module");
const achievements_module_1 = require("./modules/achievements/achievements.module");
const streaks_module_1 = require("./modules/streaks/streaks.module");
const leaderboard_module_1 = require("./modules/leaderboard/leaderboard.module");
const content_module_1 = require("./modules/content/content.module");
const competition_module_1 = require("./modules/competition/competition.module");
const prisma_module_1 = require("./common/prisma/prisma.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            typing_module_1.TypingModule,
            analytics_module_1.AnalyticsModule,
            courses_module_1.CoursesModule,
            lessons_module_1.LessonsModule,
            practice_module_1.PracticeModule,
            achievements_module_1.AchievementsModule,
            streaks_module_1.StreaksModule,
            leaderboard_module_1.LeaderboardModule,
            content_module_1.ContentModule,
            competition_module_1.CompetitionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map