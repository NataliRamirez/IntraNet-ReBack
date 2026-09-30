import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { AuthenticatedRequest } from '../interfaces/authenticated-request-interface';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';

import { UsersService } from '../services/users-service';

import { UpdateProfileDto } from '../DTOs/update-profile-dto';
import { ChangePasswordDto } from '../DTOs/change-password-dto';
import { ConfirmPasswordDto } from '../DTOs/confirm-password-dto';
import { DeleteProfileDto } from '../DTOs/delete-profile-dto';

@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  /**
   * Actualiza los datos personales
   * del usuario autenticado.
   */
  @Put()
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      request.user.email,
      body,
    );
  }

  /**
   * Cambia la contraseña
   * del usuario autenticado.
   */
  @Put('password')
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      request.user.email,
      body,
    );
  }

  /**
   * Confirma la contraseña
   * del usuario autenticado.
   */
  @Post('confirm-password')
  async confirmPassword(
    @Req() request: AuthenticatedRequest,
    @Body() body: ConfirmPasswordDto,
  ) {
    return this.usersService.confirmPassword(
      request.user.email,
      body,
    );
  }

  /**
   * Elimina definitivamente
   * el perfil del usuario.
   */
  @Delete()
  async deleteProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body: DeleteProfileDto,
  ) {
    return this.usersService.deleteProfile(
      request.user.email,
      body,
    );
  }
}