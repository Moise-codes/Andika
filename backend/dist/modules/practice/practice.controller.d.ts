import { PracticeService } from './practice.service';
export declare class PracticeController {
    private readonly practiceService;
    constructor(practiceService: PracticeService);
    createSession(user: any, createDto: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number;
        wpm: number;
        accuracy: number;
    }>;
    getSessions(user: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number;
        wpm: number;
        accuracy: number;
    }[]>;
    getRecommendations(user: any): Promise<{
        weakKeys: {
            key: string;
            errorRate: number;
        }[];
        recommendedModes: string[];
        suggestedDuration: number;
    }>;
}
