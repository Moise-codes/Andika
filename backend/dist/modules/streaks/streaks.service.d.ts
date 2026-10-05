import { PrismaService } from '../../common/prisma/prisma.service';
export declare class StreaksService {
    private prisma;
    constructor(prisma: PrismaService);
    getStreak(userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        profile_id: string;
        current_streak: number;
        longest_streak: number;
        last_practice: Date | null;
    }>;
    updateStreak(userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        profile_id: string;
        current_streak: number;
        longest_streak: number;
        last_practice: Date | null;
    }>;
}
