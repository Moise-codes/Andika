import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<{
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
    updateProfile(user: any, updateDto: any): Promise<{
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
    updateSettings(user: any, settingsDto: any): Promise<{
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
    getSettings(user: any): Promise<{
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
