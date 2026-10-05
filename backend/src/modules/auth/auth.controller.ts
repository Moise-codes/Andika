import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AppThrottlerGuard } from '../../common/guards/throttler.guard';
import { LoginDto } from '../../common/dto/login.dto';

@Controller('auth')
@UseGuards(AppThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: { name: string; email: string; password: string }) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('google')
  async googleAuth(@Body() googleDto: { idToken: string }) {
    return this.authService.googleLogin(googleDto.idToken);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyDto: { token: string }) {
    return this.authService.verifyEmail(verifyDto.token);
  }

  @Post('oauth/verify')
  async verifyOAuth(@Body() verifyDto: { accessToken: string }) {
    return this.authService.verifySupabaseToken(verifyDto.accessToken);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: { refreshToken: string }) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
