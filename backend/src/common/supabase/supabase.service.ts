import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface SupabaseEmailLookup {
  id: string;
  providers: string[];
}

/**
 * Single, shared Supabase client. Supabase is the one datastore + auth provider
 * for ANDIKA: the Postgres database (via Prisma) and Supabase Auth (email/password
 * and Google OAuth) both live in the same project.
 *
 * This client uses the service role key, so it must never be exposed to the browser.
 */
@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly client: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceRoleKey) {
      this.logger.warn(
        'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Auth requests will fail until they are configured.',
      );
    }

    this.client = createClient(url ?? '', serviceRoleKey ?? '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /** The service-role Supabase client (admin privileges). */
  get admin(): SupabaseClient {
    return this.client;
  }

  /**
   * Resolve a Supabase access token to a user. This works for both legacy
   * (HS256) and asymmetric signing keys because Supabase validates the token.
   */
  async getUserFromToken(accessToken: string): Promise<User | null> {
    if (!accessToken) return null;

    try {
      const { data, error } = await this.client.auth.getUser(accessToken);
      if (error || !data?.user) return null;
      return data.user;
    } catch (error) {
      this.logger.debug(`Token verification failed: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Look up a user by email and report which providers (email, google, ...) are
   * linked to it. Used to give people a precise "this email is registered with
   * Google" message instead of a generic failure.
   *
   * Supabase's admin list endpoint is paginated, so we page through in bounded
   * batches and return null if the user is outside the scanned window.
   */
  async findUserByEmail(email: string): Promise<SupabaseEmailLookup | null> {
    const target = email.trim().toLowerCase();
    if (!target) return null;

    const perPage = 1000;
    const maxPages = 20;

    try {
      for (let page = 1; page <= maxPages; page++) {
        const { data, error } = await this.client.auth.admin.listUsers({ page, perPage });
        if (error) {
          this.logger.warn(`Unable to list users: ${error.message}`);
          return null;
        }

        const users = data?.users ?? [];
        const match = users.find((user) => (user.email ?? '').toLowerCase() === target);

        if (match) {
          const providers = Array.from(
            new Set((match.identities ?? []).map((identity) => identity.provider)),
          );
          return { id: match.id, providers };
        }

        if (users.length < perPage) break;
      }
    } catch (error) {
      this.logger.warn(`Email lookup failed: ${(error as Error).message}`);
    }

    return null;
  }
}
