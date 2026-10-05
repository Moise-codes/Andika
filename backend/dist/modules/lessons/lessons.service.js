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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let LessonsService = class LessonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        return this.prisma.lesson.findUnique({
            where: { id },
            include: {
                exercises: true,
            },
        });
    }
    async getProgress(userId, lessonId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        return this.prisma.lessonProgress.findUnique({
            where: {
                profile_id_lesson_id: {
                    profile_id: profile.id,
                    lesson_id: lessonId,
                },
            },
        });
    }
    async updateProgress(userId, lessonId, progressDto) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        const existing = await this.prisma.lessonProgress.findUnique({
            where: {
                profile_id_lesson_id: {
                    profile_id: profile.id,
                    lesson_id: lessonId,
                },
            },
        });
        if (existing) {
            return this.prisma.lessonProgress.update({
                where: { id: existing.id },
                data: {
                    completed: progressDto.completed || existing.completed,
                    attempts: existing.attempts + 1,
                    best_accuracy: Math.max(existing.best_accuracy || 0, progressDto.accuracy || 0),
                    best_wpm: Math.max(existing.best_wpm || 0, progressDto.wpm || 0),
                    time_spent: existing.time_spent + (progressDto.timeSpent || 0),
                    completed_at: progressDto.completed ? new Date() : existing.completed_at,
                },
            });
        }
        return this.prisma.lessonProgress.create({
            data: {
                profile_id: profile.id,
                lesson_id: lessonId,
                completed: progressDto.completed || false,
                attempts: 1,
                best_accuracy: progressDto.accuracy || 0,
                best_wpm: progressDto.wpm || 0,
                time_spent: progressDto.timeSpent || 0,
                completed_at: progressDto.completed ? new Date() : null,
            },
        });
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map