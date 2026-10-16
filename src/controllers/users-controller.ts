import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { UsersService } from '../services/users-service';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles as AllowedRoles } from '../decorators/roles-decorator';

import { CreateUsersDto } from '../DTOs/create-users-dto';
import { UpdateUsersDto } from '../DTOs/update-users-dto';

import { UpdateProfileDto } from '../DTOs/update-profile-dto';
import { ChangePasswordDto } from '../DTOs/change-password-dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  // =====================================================
  // LISTAR TODOS LOS USUARIOS
  // GET /users
  // Solo ADMINISTRADOR
  // =====================================================

  @Get()
  @UseGuards(RolesGuard)
  @AllowedRoles('ADMINISTRADOR')
  findAll() {
    return this.usersService.findAll();
  }

  // =====================================================
  // LISTAR ROLES
  // GET /users/roles
  // Solo ADMINISTRADOR
  // =====================================================

  @Get('roles')
  @UseGuards(RolesGuard)
  @AllowedRoles('ADMINISTRADOR')
  findRoles() {
    return this.usersService.findRoles();
  }

  // =====================================================
  // CREAR USUARIO
  // POST /users
  // Solo ADMINISTRADOR
  // =====================================================

  @Post()
  @UseGuards(RolesGuard)
  @AllowedRoles('ADMINISTRADOR')
  create(
    @Body() dto: CreateUsersDto,
  ) {
    return this.usersService.create(dto);
  }

  // =====================================================
  // EDITAR USUARIO
  // PATCH /users/:id
  // Solo ADMINISTRADOR
  // =====================================================

  @Patch(':id')
  @UseGuards(RolesGuard)
  @AllowedRoles('ADMINISTRADOR')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsersDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // =====================================================
  // ELIMINAR USUARIO
  // DELETE /users/:id
  // Solo ADMINISTRADOR
  // =====================================================

  @Delete(':id')
  @UseGuards(RolesGuard)
  @AllowedRoles('ADMINISTRADOR')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.remove(id);
  }

  // =====================================================
  // OBTENER PERFIL DEL USUARIO AUTENTICADO
  // GET /users/profile
  // =====================================================

  @Get('profile')
  getProfile(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.getProfile(
      req.user.id,
    );
  }

  // =====================================================
  // ACTUALIZAR PERFIL
  // PATCH /users/profile
  // =====================================================

  @Patch('profile')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      req.user.id,
      dto,
    );
  }

  // =====================================================
  // CAMBIAR CONTRASEÑA
  // PATCH /users/password
  // =====================================================

  @Patch('password')
  changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.id,
      dto,
    );
  }
}
