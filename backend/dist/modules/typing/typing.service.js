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
exports.TypingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let TypingService = class TypingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(userId, createDto) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        return this.prisma.typingSession.create({
            data: {
                profile_id: profile.id,
                mode: createDto.mode,
                duration: createDto.duration,
                word_count: createDto.wordCount,
                content_type: createDto.contentType,
                wpm: 0,
                accuracy: 0,
                correct_chars: 0,
                incorrect_chars: 0,
                backspaces: 0,
                time_elapsed: 0,
            },
        });
    }
    async getSessions(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        return this.prisma.typingSession.findMany({
            where: { profile_id: profile.id },
            orderBy: { created_at: 'desc' },
        });
    }
    async getRecentSessions(userId, limit) {
        const profile = await this.prisma.profile.findUnique({
            where: { user_id: userId },
        });
        return this.prisma.typingSession.findMany({
            where: { profile_id: profile.id },
            orderBy: { created_at: 'desc' },
            take: limit,
        });
    }
    async completeSession(userId, sessionId, resultDto) {
        const validatedWPM = this.validateWPM(resultDto);
        const validatedAccuracy = this.validateAccuracy(resultDto);
        return this.prisma.typingSession.update({
            where: { id: sessionId },
            data: {
                wpm: validatedWPM,
                accuracy: validatedAccuracy,
                consistency: resultDto.consistency,
                correct_chars: resultDto.correctChars,
                incorrect_chars: resultDto.incorrectChars,
                backspaces: resultDto.backspaces,
                time_elapsed: resultDto.timeElapsed,
                validated: true,
                errors: {
                    create: resultDto.errors,
                },
                key_metrics: {
                    create: resultDto.keyMetrics,
                },
            },
        });
    }
    async getResult(sessionId) {
        return this.prisma.typingSession.findUnique({
            where: { id: sessionId },
            include: {
                errors: true,
                key_metrics: true,
            },
        });
    }
    async getResultAnalysis(sessionId) {
        const session = await this.getResult(sessionId);
        const weakKeys = this.calculateWeakKeys(session.key_metrics);
        const slowTransitions = this.calculateSlowTransitions(session.errors);
        return {
            session,
            analysis: {
                weakKeys,
                slowTransitions,
            },
        };
    }
    validateWPM(result) {
        const timeElapsedMinutes = result.timeElapsed / 60;
        if (timeElapsedMinutes <= 0)
            return 0;
        const calculatedWPM = (result.correctChars / 5) / timeElapsedMinutes;
        if (calculatedWPM < 0 || calculatedWPM > 300) {
            throw new Error('Invalid WPM calculation');
        }
        if (Math.abs(calculatedWPM - result.wpm) > 10) {
            return Math.round(calculatedWPM);
        }
        return result.wpm;
    }
    validateAccuracy(result) {
        const totalChars = result.correctChars + result.incorrectChars;
        if (totalChars === 0)
            return 100;
        const calculatedAccuracy = (result.correctChars / totalChars) * 100;
        if (calculatedAccuracy < 0 || calculatedAccuracy > 100) {
            throw new Error('Invalid accuracy calculation');
        }
        return Math.round(calculatedAccuracy);
    }
    calculateWeakKeys(keyMetrics) {
        return keyMetrics
            .filter(k => k.incorrect > k.correct)
            .sort((a, b) => b.incorrect - a.incorrect)
            .slice(0, 5);
    }
    calculateSlowTransitions(errors) {
        return errors.slice(0, 10);
    }
};
exports.TypingService = TypingService;
exports.TypingService = TypingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TypingService);
//# sourceMappingURL=typing.service.js.map