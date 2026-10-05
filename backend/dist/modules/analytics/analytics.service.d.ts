import { PrismaService } from '../../common/prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverview(userId: string): Promise<{
        currentWpm: number;
        averageWpm: number;
        bestWpm: number;
        accuracy: number;
        consistency: number;
        totalTests: number;
        totalTime: number;
    }>;
    getPerformance(userId: string, days: number): Promise<{
        date: Date;
        wpm: number;
        accuracy: number;
        consistency: number;
    }[]>;
    getWeakKeys(userId: string): Promise<{
        key: string;
        correct: number;
        incorrect: number;
        errorRate: number;
    }[]>;
    getTransitions(userId: string): Promise<{
        transition: string;
        count: number;
        errors: number;
        errorRate: number;
    }[]>;
}
