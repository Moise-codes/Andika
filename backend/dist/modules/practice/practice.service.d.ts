import { PrismaService } from '../../common/prisma/prisma.service';
export declare class PracticeService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, createDto: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number;
        wpm: number;
        accuracy: number;
    }>;
    getSessions(userId: string): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number;
        wpm: number;
        accuracy: number;
    }[]>;
    getRecommendations(userId: string): Promise<{
        weakKeys: {
            key: string;
            errorRate: number;
        }[];
        recommendedModes: string[];
        suggestedDuration: number;
    }>;
}
