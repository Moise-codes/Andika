import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/** Shape attached to `request.user` for every authenticated request. */
export interface AuthenticatedUser {
  id: string;
  email?: string;
  metadata: Record<string, any>;
  accessToken: string;
}

/**
 * Guards routes with a Supabase access token (a JWT issued by Supabase Auth).
 *
 * The token is verified by Supabase rather than a locally-held secret, so it keeps
 * working whether the project uses the legacy shared JWT secret or the newer
 * asymmetric signing keys. Controllers keep receiving `@CurrentUser() user.id`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const user = await this.supabase.getUserFromToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      metadata: (user.user_metadata as Record<string, any>) ?? {},
      accessToken: token,
    };

    request.user = authenticatedUser;
    return true;
  }

  private extractToken(request: any): string | null {
    const header = request?.headers?.authorization;
    if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
      return header.slice(7).trim();
    }
    return null;
  }
}
