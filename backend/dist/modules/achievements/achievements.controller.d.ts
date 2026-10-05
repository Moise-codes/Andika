import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    findAll(): Promise<{
        id: string;
        created_at: Date;
        title: string;
        description: string;
        category: string;
        icon: string | null;
        requirement: string;
    }[]>;
    getUserAchievements(user: any): Promise<({
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
}
