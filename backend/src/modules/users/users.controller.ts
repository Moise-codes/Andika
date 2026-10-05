import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: any, @Body() updateDto: any) {
    return this.usersService.updateProfile(user.id, updateDto);
  }

  @Patch('me/settings')
  async updateSettings(@CurrentUser() user: any, @Body() settingsDto: any) {
    return this.usersService.updateSettings(user.id, settingsDto);
  }

  @Get('me/settings')
  async getSettings(@CurrentUser() user: any) {
    return this.usersService.getSettings(user.id);
  }
}
