import { PrismaService } from '../../common/prisma/prisma.service';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        exercises: {
            id: string;
            created_at: Date;
            order: number;
            lesson_id: string;
            text: string;
        }[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string | null;
        order: number;
        module_id: string;
        objectives: string[];
        instructions: string | null;
        accuracy_requirement: number;
        speed_target: number | null;
    }>;
    getProgress(userId: string, lessonId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        profile_id: string;
        lesson_id: string;
        completed: boolean;
        attempts: number;
        best_accuracy: number | null;
        best_wpm: number | null;
        time_spent: number;
        completed_at: Date | null;
    }>;
    updateProgress(userId: string, lessonId: string, progressDto: any): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        profile_id: string;
        lesson_id: string;
        completed: boolean;
        attempts: number;
        best_accuracy: number | null;
        best_wpm: number | null;
        time_spent: number;
        completed_at: Date | null;
    }>;
}
