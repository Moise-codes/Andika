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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const sessions = await this.prisma.typingSession.findMany({
            where: { profile_id: profile.id, validated: true },
            orderBy: { created_at: 'desc' },
            take: 100,
        });
        if (sessions.length === 0) {
            return {
                currentWpm: 0,
                averageWpm: 0,
                bestWpm: 0,
                accuracy: 0,
                consistency: 0,
                totalTests: 0,
                totalTime: 0,
            };
        }
        const currentWpm = sessions[0].wpm;
        const averageWpm = sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length;
        const bestWpm = Math.max(...sessions.map(s => s.wpm));
        const accuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
        const consistency = sessions.reduce((sum, s) => sum + (s.consistency || 0), 0) / sessions.filter(s => s.consistency).length;
        const totalTime = sessions.reduce((sum, s) => sum + s.time_elapsed, 0);
        return {
            currentWpm,
            averageWpm,
            bestWpm,
            accuracy,
            consistency: consistency || 0,
            totalTests: sessions.length,
            totalTime,
        };
    }
    async getPerformance(userId, days) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const sessions = await this.prisma.typingSession.findMany({
            where: {
                profile_id: profile.id,
                validated: true,
                created_at: { gte: startDate },
            },
            orderBy: { created_at: 'asc' },
        });
        return sessions.map(s => ({
            date: s.created_at,
            wpm: s.wpm,
            accuracy: s.accuracy,
            consistency: s.consistency,
        }));
    }
    async getWeakKeys(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const sessions = await this.prisma.typingSession.findMany({
            where: { profile_id: profile.id, validated: true },
            include: { key_metrics: true },
            take: 50,
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
        return Array.from(keyStats.entries())
            .map(([key, stats]) => ({
            key,
            correct: stats.correct,
            incorrect: stats.incorrect,
            errorRate: stats.incorrect / (stats.correct + stats.incorrect),
        }))
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10);
    }
    async getTransitions(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const sessions = await this.prisma.typingSession.findMany({
            where: { profile_id: profile.id, validated: true },
            include: { errors: true },
            take: 50,
        });
        const transitionStats = new Map();
        sessions.forEach(session => {
            session.errors.forEach(error => {
                const transition = `${error.expected_char}->${error.actual_char}`;
                const existing = transitionStats.get(transition) || { count: 0, errors: 0 };
                transitionStats.set(transition, {
                    count: existing.count + 1,
                    errors: existing.errors + 1,
                });
            });
        });
        return Array.from(transitionStats.entries())
            .map(([transition, stats]) => ({
            transition,
            count: stats.count,
            errors: stats.errors,
            errorRate: stats.errors / stats.count,
        }))
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map