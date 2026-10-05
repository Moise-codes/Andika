"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let AchievementsService = class AchievementsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.achievement.findMany({
            orderBy: { category: 'asc' },
        });
    }
    async getUserAchievements(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const userAchievements = await this.prisma.userAchievement.findMany({
            where: { profile_id: profile.id },
            include: { achievement: true },
            orderBy: { unlocked_at: 'desc' },
        });
        return userAchievements;
    }
    async checkAndAwardAchievements(userId, sessionData) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
            include: { achievements: true },
        });
        const allAchievements = await this.prisma.achievement.findMany();
        const newAchievements = [];
        for (const achievement of allAchievements) {
            if (profile.achievements.some(ua => ua.achievement_id === achievement.id)) {
                continue;
            }
            if (await this.checkAchievementCondition(achievement, profile, sessionData)) {
                await this.prisma.userAchievement.create({
                    data: {
                        profile_id: profile.id,
                        achievement_id: achievement.id,
                    },
                });
                newAchievements.push(achievement);
            }
        }
        return newAchievements;
    }
    async checkAchievementCondition(achievement, profile, sessionData) {
        const sessions = await this.prisma.typingSession.findMany({
            where: { profile_id: profile.id, validated: true },
        });
        switch (achievement.id) {
            case 'first_test':
                return sessions.length >= 1;
            case '1000_chars':
                const totalChars = sessions.reduce((sum, s) => sum + s.correct_chars + s.incorrect_chars, 0);
                return totalChars >= 1000;
            case '7_day_streak':
                const streak = await this.prisma.streak.findUnique({
                    where: { profile_id: profile.id },
                });
                return streak?.current_streak >= 7;
            case '100_wpm':
                return sessions.some(s => s.wpm >= 100);
            case '99_accuracy':
                return sessions.some(s => s.accuracy >= 99);
            default:
                return false;
        }
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map