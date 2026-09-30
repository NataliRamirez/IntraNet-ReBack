import {
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
import { ConfirmPasswordDto } from '../DTOs/confirm-password-dto';
import { DeleteProfileDto } from '../DTOs/delete-profile-dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  /**
   * Busca un usuario por email.
   */
  async findByEmail(email: string): Promise<Users | null> {

    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['role'],
    });
  }

  /**
   * Actualiza los datos del perfil.
   */
  async updateProfile(
    email: string,
    request: UpdateProfileDto,
  ) {

    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    if (request.name !== undefined) {
      user.name = request.name;
    }

    if (request.email !== undefined) {
      user.email = request.email;
    }

    if (request.job_position !== undefined) {
      user.job_position = request.job_position;
    }

    const updatedUser =
      await this.userRepository.save(user);

    return {
      message: 'Perfil actualizado correctamente',

      data: {
        userId: updatedUser.id,
        id_card: updatedUser.id_card,
        name: updatedUser.name,
        email: updatedUser.email,
        job_position: updatedUser.job_position,
      },
    };
  }

  /**
   * Cambia la contraseña.
   */
  async changePassword(
    email: string,
    request: ChangePasswordDto,
  ) {

    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const validPassword =
      await bcrypt.compare(
        request.currentPassword,
        user.password,
      );

    if (!validPassword) {
      throw new UnauthorizedException(
        'La contraseña actual es incorrecta',
      );
    }

    user.password =
      await bcrypt.hash(
        request.newPassword,
        10,
      );

    await this.userRepository.save(user);

    return {
      message: 'Contraseña actualizada correctamente',
      data: null,
    };
  }

  /**
   * Confirma la contraseña.
   */
  async confirmPassword(
    email: string,
    request: ConfirmPasswordDto,
  ) {

    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const validPassword =
      await bcrypt.compare(
        request.password,
        user.password,
      );

    if (!validPassword) {
      throw new UnauthorizedException(
        'La contraseña es incorrecta',
      );
    }

    return {
      message: 'Contraseña confirmada correctamente',

      data: {
        confirmed: true,
        timestamp: new Date(),
      },
    };
  }

  /**
   * Elimina definitivamente el usuario.
   */
  async deleteProfile(
    email: string,
    request: DeleteProfileDto,
  ) {

    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const validPassword =
      await bcrypt.compare(
        request.password,
        user.password,
      );

    if (!validPassword) {
      throw new UnauthorizedException(
        'La contraseña es incorrecta',
      );
    }

    await this.userRepository.delete(
      user.id,
    );

    return {
      message: 'Perfil eliminado correctamente',

      data: {
        deleted: true,
        userId: user.id,
      },
    };
  }
}