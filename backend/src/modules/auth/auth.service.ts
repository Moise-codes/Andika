import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private googleClient: OAuth2Client;
  private verificationTokens = new Map<string, { email: string; expiresAt: number }>();

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  async signup(signupDto: { name: string; email: string; password: string }) {
    // Validate email domain (reject fake emails)
    const fakeDomains = ['example.com', 'test.com', 'fake.com', 'temp.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com'];
    const domain = signupDto.email.split('@')[1]?.toLowerCase();
    if (fakeDomains.includes(domain)) {
      throw new Error('Fake or temporary email addresses are not allowed');
    }

    // Create an already-confirmed user without sending a verification email.
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: signupDto.email,
      password: signupDto.password,
      email_confirm: true,
      user_metadata: {
        full_name: signupDto.name,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;

    if (!user) {
      throw new Error('User was not created successfully');
    }

    await this.ensureProfileExists(user);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      requiresVerification: false,
      message: 'Account created successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: signupDto.name,
      },
    };
  }

  async verifyEmail(token: string) {
    const storedToken = this.verificationTokens.get(token);

    if (!storedToken) {
      throw new Error('Invalid or expired verification token');
    }

    if (Date.now() > storedToken.expiresAt) {
      this.verificationTokens.delete(token);
      throw new Error('Verification token has expired');
    }

    // Confirm email in Supabase
    const { error } = await this.supabase.auth.admin.updateUserById(
      (await this.getUserByEmail(storedToken.email)).id,
      { email_confirm: true }
    );

    if (error) {
      throw new Error('Failed to verify email');
    }

    this.verificationTokens.delete(token);

    return { message: 'Email verified successfully' };
  }

  private async getUserByEmail(email: string) {
    const { data: { users } } = await this.supabase.auth.admin.listUsers();
    return users.find(u => u.email === email);
  }

  async login(loginDto: { email: string; password: string }) {
    let data;
    let error;

    ({ data, error } = await this.supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    }));

    if (error && error.message?.toLowerCase().includes('not confirmed')) {
      const user = await this.getUserByEmail(loginDto.email);

      if (user) {
        const { error: confirmError } = await this.supabase.auth.admin.updateUserById(user.id, {
          email_confirm: true,
        });

        if (!confirmError) {
          ({ data, error } = await this.supabase.auth.signInWithPassword({
            email: loginDto.email,
            password: loginDto.password,
          }));
        }
      }
    }

    if (error || !data?.user) {
      throw new Error('Invalid credentials');
    }

    // Ensure profile exists
    await this.ensureProfileExists(data.user);

    const payload = { sub: data.user.id, email: data.user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  }

  async googleLogin(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error('Invalid Google token');
      }

      // Validate email domain (reject fake emails)
      const fakeDomains = ['example.com', 'test.com', 'fake.com', 'temp.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com'];
      const domain = payload.email.split('@')[1]?.toLowerCase();
      if (fakeDomains.includes(domain)) {
        throw new Error('Fake or temporary email addresses are not allowed');
      }

      // Check if user exists in Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser();

      // For Google auth, we'll create or get the user via email
      // This is a simplified version - in production you'd use proper OAuth flow
      const { data: existingUser } = await this.supabase.auth.admin.listUsers();
      const matchedUser = existingUser.users.find(u => u.email === payload.email);

      let userId = matchedUser?.id;

      if (!userId) {
        // Create new user with Google info
        const { data: newUser, error: createError } = await this.supabase.auth.admin.createUser({
          email: payload.email,
          email_confirm: true,
          user_metadata: {
            full_name: payload.name,
            avatar_url: payload.picture,
            provider: 'google',
          },
          password: Math.random().toString(36).slice(-8), // Random password for Google users
        });

        if (createError || !newUser.user) {
          throw new Error('Failed to create user');
        }
        userId = newUser.user.id;
      }

      const userPayload = { sub: userId, email: payload.email };
      const accessToken = this.jwtService.sign(userPayload);
      const refreshToken = this.jwtService.sign(userPayload, { expiresIn: '30d' });

      // Ensure profile exists
      await this.ensureProfileExists({ id: userId, email: payload.email, user_metadata: { full_name: payload.name, avatar_url: payload.picture } });

      return {
        accessToken,
        refreshToken,
        user: {
          id: userId,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
        },
      };
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  }

  async verifySupabaseToken(accessToken: string) {
    try {
      const { data, error } = await this.supabase.auth.getUser(accessToken);

      if (error || !data.user) {
        throw new Error('Invalid Supabase token');
      }

      // Ensure profile exists
      await this.ensureProfileExists(data.user);

      const payload = { sub: data.user.id, email: data.user.email };
      const jwtToken = this.jwtService.sign(payload);
      const jwtRefreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

      return {
        accessToken: jwtToken,
        refreshToken: jwtRefreshToken,
        user: {
          id: data.user.id,
          email: data.user.email,
          metadata: data.user.user_metadata,
        },
      };
    } catch (e) {
      throw new Error('Token verification failed');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { sub: payload.sub, email: payload.email };
      const accessToken = this.jwtService.sign(newPayload);

      return { accessToken };
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // In a real implementation, you would invalidate the token
    // For now, we'll just return success
    return { message: 'Logged out successfully' };
  }

  private async ensureProfileExists(supabaseUser: any) {
    let profile = await this.prisma.profile.findUnique({
      where: { user_id: supabaseUser.id },
    });

    if (!profile) {
      // Create new profile on first login
      const username = this.generateUsername(supabaseUser.email);

      profile = await this.prisma.profile.create({
        data: {
          user_id: supabaseUser.id,
          username,
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          public_profile: true,
          leaderboard_visibility: true,
          country_visibility: true,
          statistics_visibility: true,
        },
      });

      // Initialize typing settings
      await this.prisma.typingSettings.create({
        data: {
          profile_id: profile.id,
          keyboard_layout: 'qwerty',
          theme: 'forest',
          sound_enabled: true,
          sound_type: 'mechanical',
          sound_volume: 0.5,
          caret_style: 'block',
          caret_behavior: 'blink',
          show_keyboard: true,
        },
      });

      // Initialize streak
      await this.prisma.streak.create({
        data: {
          profile_id: profile.id,
          current_streak: 0,
          longest_streak: 0,
        },
      });
    }

    return profile;
  }

  private generateUsername(email: string): string {
    const localPart = email.split('@')[0];
    const cleanUsername = localPart.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${cleanUsername}${randomSuffix}`;
  }
}
