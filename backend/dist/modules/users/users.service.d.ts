import { PrismaService } from '../../common/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        streak: {
            id: string;
            created_at: Date;
            updated_at: Date;
            profile_id: string;
            current_streak: number;
            longest_streak: number;
            last_practice: Date | null;
        };
        typing_settings: {
            id: string;
            created_at: Date;
            updated_at: Date;
            keyboard_layout: string;
            theme: string;
            sound_enabled: boolean;
            sound_type: string | null;
            sound_volume: number;
            caret_style: string;
            caret_behavior: string;
            show_keyboard: boolean;
            profile_id: string;
        };
    } & {
        id: string;
        user_id: string;
        username: string;
        avatar_url: string | null;
        country: string | null;
        timezone: string;
        public_profile: boolean;
        leaderboard_visibility: boolean;
        country_visibility: boolean;
        statistics_visibility: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    updateProfile(userId: string, updateDto: any): Promise<{
        id: string;
        user_id: string;
        username: string;
        avatar_url: string | null;
        country: string | null;
        timezone: string;
        public_profile: boolean;
        leaderboard_visibility: boolean;
        country_visibility: boolean;
        statistics_visibility: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    getSettings(userId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        keyboard_layout: string;
        theme: string;
        sound_enabled: boolean;
        sound_type: string | null;
        sound_volume: number;
        caret_style: string;
        caret_behavior: string;
        show_keyboard: boolean;
        profile_id: string;
    }>;
    updateSettings(userId: string, settingsDto: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        keyboard_layout: string;
        theme: string;
        sound_enabled: boolean;
        sound_type: string | null;
        sound_volume: number;
        caret_style: string;
        caret_behavior: string;
        show_keyboard: boolean;
        profile_id: string;
    }>;
}
