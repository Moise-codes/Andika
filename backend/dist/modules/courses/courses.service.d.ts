import { PrismaService } from '../../common/prisma/prisma.service';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        modules: ({
            lessons: {
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
            }[];
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            title: string;
            description: string | null;
            order: number;
            course_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        language: string;
        order: number;
        published: boolean;
    })[]>;
    findPublished(): Promise<({
        modules: ({
            lessons: {
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
            }[];
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            title: string;
            description: string | null;
            order: number;
            course_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        language: string;
        order: number;
        published: boolean;
    })[]>;
    findOne(id: string): Promise<{
        modules: ({
            lessons: {
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
            }[];
        } & {
            id: string;
            created_at: Date;
            updated_at: Date;
            title: string;
            description: string | null;
            order: number;
            course_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string;
        language: string;
        order: number;
        published: boolean;
    }>;
    findModules(courseId: string): Promise<({
        lessons: {
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
        }[];
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        title: string;
        description: string | null;
        order: number;
        course_id: string;
    })[]>;
}
