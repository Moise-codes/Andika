export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
    };
    live(): {
        status: string;
    };
    ready(): {
        status: string;
    };
}
