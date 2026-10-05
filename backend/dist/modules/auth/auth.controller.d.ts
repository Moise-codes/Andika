import { AuthService } from './auth.service';
import { LoginDto } from '../../common/dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        requiresVerification: boolean;
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
        };
    }>;
    googleAuth(googleDto: {
        idToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
    }>;
    verifyEmail(verifyDto: {
        token: string;
    }): Promise<{
        message: string;
    }>;
    verifyOAuth(verifyDto: {
        accessToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            metadata: import("@supabase/auth-js").UserMetadata;
        };
    }>;
    refresh(refreshTokenDto: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
    getProfile(req: any): Promise<any>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
