import { PrismaService } from '../../common/prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    getTypingContent(type?: string, language?: string, difficulty?: string): Promise<{
        id: string;
        created_at: Date;
        language: string;
        text: string;
        type: string;
        difficulty: string | null;
        tags: string[];
    }[]>;
    getProgrammingContent(language?: string, difficulty?: string): Promise<{
        id: string;
        created_at: Date;
        language: string;
        difficulty: string | null;
        code: string;
    }[]>;
}
