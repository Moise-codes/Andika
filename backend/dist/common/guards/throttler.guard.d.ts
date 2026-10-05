import { ThrottlerGuard } from '@nestjs/throttler';
export declare class AppThrottlerGuard extends ThrottlerGuard {
    protected errorMessage: string;
}
