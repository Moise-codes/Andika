import { TypingService } from './typing.service';
export declare class TypingController {
    private readonly typingService;
    constructor(typingService: TypingService);
    createSession(user: any, createDto: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number | null;
        word_count: number | null;
        content_type: string;
        wpm: number;
        accuracy: number;
        consistency: number | null;
        correct_chars: number;
        incorrect_chars: number;
        backspaces: number;
        time_elapsed: number;
        validated: boolean;
    }>;
    getSessions(user: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number | null;
        word_count: number | null;
        content_type: string;
        wpm: number;
        accuracy: number;
        consistency: number | null;
        correct_chars: number;
        incorrect_chars: number;
        backspaces: number;
        time_elapsed: number;
        validated: boolean;
    }[]>;
    getRecentSessions(user: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number | null;
        word_count: number | null;
        content_type: string;
        wpm: number;
        accuracy: number;
        consistency: number | null;
        correct_chars: number;
        incorrect_chars: number;
        backspaces: number;
        time_elapsed: number;
        validated: boolean;
    }[]>;
    completeSession(user: any, id: string, resultDto: any): Promise<{
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number | null;
        word_count: number | null;
        content_type: string;
        wpm: number;
        accuracy: number;
        consistency: number | null;
        correct_chars: number;
        incorrect_chars: number;
        backspaces: number;
        time_elapsed: number;
        validated: boolean;
    }>;
    getResult(id: string): Promise<{
        errors: {
            id: string;
            created_at: Date;
            index: number;
            expected_char: string;
            actual_char: string;
            session_id: string;
        }[];
        key_metrics: {
            id: string;
            created_at: Date;
            session_id: string;
            key: string;
            correct: number;
            incorrect: number;
            avgTime: number;
        }[];
    } & {
        id: string;
        created_at: Date;
        profile_id: string;
        mode: string;
        duration: number | null;
        word_count: number | null;
        content_type: string;
        wpm: number;
        accuracy: number;
        consistency: number | null;
        correct_chars: number;
        incorrect_chars: number;
        backspaces: number;
        time_elapsed: number;
        validated: boolean;
    }>;
    getResultAnalysis(id: string): Promise<{
        session: {
            errors: {
                id: string;
                created_at: Date;
                index: number;
                expected_char: string;
                actual_char: string;
                session_id: string;
            }[];
            key_metrics: {
                id: string;
                created_at: Date;
                session_id: string;
                key: string;
                correct: number;
                incorrect: number;
                avgTime: number;
            }[];
        } & {
            id: string;
            created_at: Date;
            profile_id: string;
            mode: string;
            duration: number | null;
            word_count: number | null;
            content_type: string;
            wpm: number;
            accuracy: number;
            consistency: number | null;
            correct_chars: number;
            incorrect_chars: number;
            backspaces: number;
            time_elapsed: number;
            validated: boolean;
        };
        analysis: {
            weakKeys: any[];
            slowTransitions: any[];
        };
    }>;
}
