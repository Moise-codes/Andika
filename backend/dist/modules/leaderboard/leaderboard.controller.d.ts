import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getGlobal(limit?: string): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getByCountry(country: string, limit?: string): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getWeekly(limit?: string): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getMonthly(limit?: string): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getAllTime(limit?: string): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
}
