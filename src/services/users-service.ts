import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Users } from '../entities/users-entity';

import { UpdateProfileDto } from '../DTOs/update-profile-dto';
import { ChangePasswordDto } from '../DTOs/change-password-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  // =====================================================
  // OBTENER PERFIL
  // =====================================================

  async getProfile(userId: number) {
    const user =
      await this.usersRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['role'],
      });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return {
      id: user.id,
      id_card: user.id_card,
      name: user.name,
      email: user.email,
      job_position: user.job_position,
      role: user.role?.name,
    };
  }

  // =====================================================
  // ACTUALIZAR PERFIL
  // =====================================================

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user =
      await this.usersRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['role'],
      });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    // Actualizar solamente los campos
    // permitidos del perfil.
    if (
      updateProfileDto.name !== undefined
    ) {
      user.name = updateProfileDto.name;
    }

    if (
      updateProfileDto.email !== undefined
    ) {
      const existingUser =
        await this.usersRepository.findOne({
          where: {
            email: updateProfileDto.email,
          },
        });

      if (
        existingUser &&
        existingUser.id !== userId
      ) {
        throw new BadRequestException(
          'El correo electrónico ya está registrado',
        );
      }

      user.email =
        updateProfileDto.email;
    }

    if (
      updateProfileDto.job_position !== undefined
    ) {
      user.job_position =
        updateProfileDto.job_position;
    }

    const updatedUser =
      await this.usersRepository.save(user);

    return {
      message:
        'Perfil actualizado correctamente',

      user: {
        id: updatedUser.id,
        id_card: updatedUser.id_card,
        name: updatedUser.name,
        email: updatedUser.email,
        job_position:
          updatedUser.job_position,
        role:
          updatedUser.role?.name,
      },
    };
  }

  // =====================================================
  // CAMBIAR CONTRASEÑA
  // =====================================================

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user =
      await this.usersRepository.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const passwordValid =
      await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'La contraseña actual es incorrecta',
      );
    }

    if (
      changePasswordDto.currentPassword ===
      changePasswordDto.newPassword
    ) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );

    user.password = hashedPassword;

    await this.usersRepository.save(user);

    return {
      message:
        'Contraseña actualizada correctamente',
    };
  }
}