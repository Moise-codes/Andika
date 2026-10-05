import { StreaksService } from './streaks.service';
export declare class StreaksController {
    private readonly streaksService;
    constructor(streaksService: StreaksService);
    getStreak(user: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        profile_id: string;
        current_streak: number;
        longest_streak: number;
        last_practice: Date | null;
    }>;
    updateStreak(user: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        profile_id: string;
        current_streak: number;
        longest_streak: number;
        last_practice: Date | null;
    }>;
}
