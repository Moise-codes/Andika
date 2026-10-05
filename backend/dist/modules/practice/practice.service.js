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
exports.PracticeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let PracticeService = class PracticeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(userId, createDto) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        return this.prisma.practiceSession.create({
            data: {
                profile_id: profile.id,
                mode: createDto.mode,
                duration: createDto.duration,
                wpm: createDto.wpm,
                accuracy: createDto.accuracy,
            },
        });
    }
    async getSessions(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        return this.prisma.practiceSession.findMany({
            where: { profile_id: profile.id },
            orderBy: { created_at: 'desc' },
            take: 50,
        });
    }
    async getRecommendations(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const sessions = await this.prisma.typingSession.findMany({
            where: { profile_id: profile.id, validated: true },
            include: { key_metrics: true },
            take: 20,
            orderBy: { created_at: 'desc' },
        });
        const keyStats = new Map();
        sessions.forEach(session => {
            session.key_metrics.forEach(metric => {
                const existing = keyStats.get(metric.key) || { correct: 0, incorrect: 0 };
                keyStats.set(metric.key, {
                    correct: existing.correct + metric.correct,
                    incorrect: existing.incorrect + metric.incorrect,
                });
            });
        });
        const weakKeys = Array.from(keyStats.entries())
            .map(([key, stats]) => ({
            key,
            errorRate: stats.incorrect / (stats.correct + stats.incorrect),
        }))
            .filter(k => k.errorRate > 0.3)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 5);
        return {
            weakKeys,
            recommendedModes: ['weak_keys', 'accuracy'],
            suggestedDuration: 300,
        };
    }
};
exports.PracticeService = PracticeService;
exports.PracticeService = PracticeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PracticeService);
//# sourceMappingURL=practice.service.js.map