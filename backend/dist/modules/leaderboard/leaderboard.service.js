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
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let LeaderboardService = class LeaderboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGlobal(limit) {
        const profiles = await this.prisma.profile.findMany({
            where: { leaderboard_visibility: true },
            include: {
                typing_sessions: {
                    where: { validated: true },
                    orderBy: { wpm: 'desc' },
                    take: 1,
                },
            },
            take: limit,
        });
        return profiles
            .map(p => ({
            username: p.username,
            country: p.country,
            bestWpm: p.typing_sessions[0]?.wpm || 0,
            bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
        }))
            .sort((a, b) => b.bestWpm - a.bestWpm);
    }
    async getByCountry(country, limit) {
        const profiles = await this.prisma.profile.findMany({
            where: {
                leaderboard_visibility: true,
                country: country.toUpperCase(),
            },
            include: {
                typing_sessions: {
                    where: { validated: true },
                    orderBy: { wpm: 'desc' },
                    take: 1,
                },
            },
            take: limit,
        });
        return profiles
            .map(p => ({
            username: p.username,
            country: p.country,
            bestWpm: p.typing_sessions[0]?.wpm || 0,
            bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
        }))
            .sort((a, b) => b.bestWpm - a.bestWpm);
    }
    async getWeekly(limit) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const profiles = await this.prisma.profile.findMany({
            where: { leaderboard_visibility: true },
            include: {
                typing_sessions: {
                    where: {
                        validated: true,
                        created_at: { gte: oneWeekAgo },
                    },
                    orderBy: { wpm: 'desc' },
                    take: 1,
                },
            },
            take: limit,
        });
        return profiles
            .map(p => ({
            username: p.username,
            country: p.country,
            bestWpm: p.typing_sessions[0]?.wpm || 0,
            bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
        }))
            .sort((a, b) => b.bestWpm - a.bestWpm);
    }
    async getMonthly(limit) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const profiles = await this.prisma.profile.findMany({
            where: { leaderboard_visibility: true },
            include: {
                typing_sessions: {
                    where: {
                        validated: true,
                        created_at: { gte: oneMonthAgo },
                    },
                    orderBy: { wpm: 'desc' },
                    take: 1,
                },
            },
            take: limit,
        });
        return profiles
            .map(p => ({
            username: p.username,
            country: p.country,
            bestWpm: p.typing_sessions[0]?.wpm || 0,
            bestAccuracy: p.typing_sessions[0]?.accuracy || 0,
        }))
            .sort((a, b) => b.bestWpm - a.bestWpm);
    }
    async getAllTime(limit) {
        return this.getGlobal(limit);
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map