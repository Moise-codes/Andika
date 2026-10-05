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
exports.StreaksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let StreaksService = class StreaksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStreak(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
            include: { streak: true },
        });
        if (!profile.streak) {
            return this.prisma.streak.create({
                data: {
                    profile_id: profile.id,
                    current_streak: 0,
                    longest_streak: 0,
                },
            });
        }
        return profile.streak;
    }
    async updateStreak(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
            include: { streak: true },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastPractice = profile.streak?.last_practice
            ? new Date(profile.streak.last_practice)
            : null;
        if (lastPractice) {
            lastPractice.setHours(0, 0, 0, 0);
        }
        const daysSinceLastPractice = lastPractice
            ? Math.floor((today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24))
            : 1;
        let newCurrentStreak = profile.streak?.current_streak || 0;
        let newLongestStreak = profile.streak?.longest_streak || 0;
        if (daysSinceLastPractice === 0) {
            return profile.streak;
        }
        else if (daysSinceLastPractice === 1) {
            newCurrentStreak += 1;
            newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
        }
        else {
            newCurrentStreak = 1;
        }
        return this.prisma.streak.update({
            where: { id: profile.streak.id },
            data: {
                current_streak: newCurrentStreak,
                longest_streak: newLongestStreak,
                last_practice: new Date(),
            },
        });
    }
};
exports.StreaksService = StreaksService;
exports.StreaksService = StreaksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StreaksService);
//# sourceMappingURL=streaks.service.js.map