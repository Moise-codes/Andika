import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
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
    findModules(id: string): Promise<({
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
