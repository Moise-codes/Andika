import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
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
