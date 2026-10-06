import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Return the signed-in user's profile, creating it on first access.
   * Authentication itself (signup, login, OTP, Google) is owned by Supabase Auth
   * on the client; the backend only maintains application data.
   */
  async getMe(user: AuthenticatedUser) {
    return this.ensureProfile(user);
  }

  /** Idempotent profile bootstrap, used right after a successful sign-in. */
  async sync(user: AuthenticatedUser) {
    return this.ensureProfile(user);
  }

  /**
   * Reports whether an email already exists and which identity providers are
   * linked to it. The frontend uses this to guide people who try to sign up with
   * email/password when their address is already registered with Google.
   */
  async getEmailStatus(email: string) {
    const match = await this.supabase.findUserByEmail(email);

    if (!match) {
      return { exists: false, providers: [] as string[] };
    }

    return { exists: true, providers: match.providers };
  }

  /**
   * Set or change the current user's password. This is what lets someone who
   * signed up with Google add an email/password credential to the same account
   * (Supabase keeps both identities on one user).
   */
  async setPassword(userId: string, password: string) {
    const { error } = await this.supabase.admin.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Password updated successfully.' };
  }

  private async ensureProfile(user: AuthenticatedUser) {
    const existing = await this.prisma.profile.findUnique({
      where: { user_id: user.id },
      include: { typing_settings: true, streak: true },
    });

    if (existing) {
      return existing;
    }

    const metadata = user.metadata ?? {};
    const fullName: string =
      metadata.full_name || metadata.name || metadata.fullName || '';
    const avatarUrl: string | undefined =
      metadata.avatar_url || metadata.picture || undefined;

    try {
      const username = await this.generateUniqueUsername(user.email);
      const profile = await this.prisma.profile.create({
        data: {
          user_id: user.id,
          username,
          avatar_url: avatarUrl ?? null,
          public_profile: true,
          leaderboard_visibility: true,
          country_visibility: true,
          statistics_visibility: true,
        },
      });

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

      await this.prisma.streak.create({
        data: {
          profile_id: profile.id,
          current_streak: 0,
          longest_streak: 0,
        },
      });

      if (user.email) {
        // Fire-and-forget: a failed welcome email must never block sign-in.
        void this.emailService
          .sendWelcomeEmail(user.email, fullName || username)
          .catch((error) =>
            this.logger.warn(`Welcome email failed for ${user.email}: ${error?.message}`),
          );
      }
    } catch (error) {
      // A concurrent request may have created the profile first — that's fine.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.debug(`Profile for user ${user.id} already existed.`);
      } else {
        throw error;
      }
    }

    return this.prisma.profile.findUnique({
      where: { user_id: user.id },
      include: { typing_settings: true, streak: true },
    });
  }

  private async generateUniqueUsername(email?: string): Promise<string> {
    const base = (email?.split('@')[0] ?? 'typist')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .slice(0, 20) || 'typist';

    for (let attempt = 0; attempt < 6; attempt++) {
      const candidate =
        attempt === 0
          ? base
          : `${base}${Math.floor(1000 + Math.random() * 9000)}`;

      const taken = await this.prisma.profile.findUnique({
        where: { username: candidate },
        select: { id: true },
      });

      if (!taken) return candidate;
    }

    return `${base}${Date.now().toString(36)}`;
  }
}
