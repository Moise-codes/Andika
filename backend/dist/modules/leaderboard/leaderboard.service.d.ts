import { PrismaService } from '../../common/prisma/prisma.service';
export declare class LeaderboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getGlobal(limit: number): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getByCountry(country: string, limit: number): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getWeekly(limit: number): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getMonthly(limit: number): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
    getAllTime(limit: number): Promise<{
        username: string;
        country: string;
        bestWpm: number;
        bestAccuracy: number;
    }[]>;
}
