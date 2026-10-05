import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private jwtService;
    private prisma;
    private emailService;
    private supabase;
    private googleClient;
    private verificationTokens;
    constructor(jwtService: JwtService, prisma: PrismaService, emailService: EmailService);
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
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    private getUserByEmail;
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
        };
    }>;
    googleLogin(idToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
    }>;
    verifySupabaseToken(accessToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            metadata: import("@supabase/supabase-js").UserMetadata;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private ensureProfileExists;
    private generateUsername;
}
