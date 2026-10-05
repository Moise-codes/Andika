import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(user: any): Promise<{
        currentWpm: number;
        averageWpm: number;
        bestWpm: number;
        accuracy: number;
        consistency: number;
        totalTests: number;
        totalTime: number;
    }>;
    getPerformance(user: any, days?: string): Promise<{
        date: Date;
        wpm: number;
        accuracy: number;
        consistency: number;
    }[]>;
    getWeakKeys(user: any): Promise<{
        key: string;
        correct: number;
        incorrect: number;
        errorRate: number;
    }[]>;
    getTransitions(user: any): Promise<{
        transition: string;
        count: number;
        errors: number;
        errorRate: number;
    }[]>;
}
