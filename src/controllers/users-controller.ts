import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../services/users-service';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';

import { UpdateProfileDto } from '../DTOs/update-profile-dto';
import { ChangePasswordDto } from '../dto/change-password-dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('profile')
  async getProfile(
    @Req() req: any,
  ) {
    return this.usersService.getProfile(
      req.user.id,
    );
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: any,
    @Body()
    updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
  }

  @Patch('password')
  async changePassword(
    @Req() req: any,
    @Body()
    changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.id,
      changePasswordDto,
    );
  }
}