import { PrismaService } from '../../common/prisma/prisma.service';
export declare class AchievementsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        created_at: Date;
        title: string;
        description: string;
        category: string;
        icon: string | null;
        requirement: string;
    }[]>;
    getUserAchievements(userId: string): Promise<({
        achievement: {
            id: string;
            created_at: Date;
            title: string;
            description: string;
            category: string;
            icon: string | null;
            requirement: string;
        };
    } & {
        id: string;
        profile_id: string;
        achievement_id: string;
        unlocked_at: Date;
    })[]>;
    checkAndAwardAchievements(userId: string, sessionData: any): Promise<any[]>;
    private checkAchievementCondition;
}
