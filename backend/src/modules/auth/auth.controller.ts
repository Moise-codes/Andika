import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SetPasswordDto } from '../../common/dto/set-password.dto';
import { EmailStatusDto } from '../../common/dto/email-status.dto';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Current user's profile (creates it on first call). */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user);
  }

  /** Bootstrap/sync the profile right after sign-in. */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async sync(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.sync(user);
  }

  /**
   * Check whether an email is already registered and with which providers.
   * Public (throttled) so the signup form can guide people to Google sign-in.
   */
  @Get('email-status')
  async emailStatus(@Query() query: EmailStatusDto) {
    return this.authService.getEmailStatus(query.email);
  }

  /** Set or change the password for the current account. */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('password')
  async setPassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetPasswordDto,
  ) {
    return this.authService.setPassword(user.id, dto.password);
  }
}
