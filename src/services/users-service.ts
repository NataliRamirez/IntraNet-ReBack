import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Users } from '../entities/users-entity';
import { UpdateProfileDto } from '../DTOs/update-profile-dto';
import { ChangePasswordDto } from '../DTOs/change-password-dto';
import { Roles } from '../entities/roles-entity';
import { CreateUsersDto } from '../DTOs/create-users-dto';
import { UpdateUsersDto } from '../DTOs/update-users-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) { }

  // =====================================================
  // RESPUESTA PÚBLICA DEL PERFIL
  // =====================================================

  private formatUser(user: Users) {
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
  // LISTAR USUARIOS
  // =====================================================

  async findAll() {
    const users = await this.usersRepository.find({
      relations: { role: true },
      order: { id: 'ASC' },
    });

    return users.map((user) => ({
      id: user.id,
      id_card: user.id_card,
      name: user.name,
      email: user.email,
      job_position: user.job_position,
      role_id: user.role?.id,
      role: user.role
        ? {
          id: user.role.id,
          name: user.role.name,
        }
        : null,
    }));
  }

  // =====================================================
  // LISTAR ROLES
  // =====================================================

  async findRoles() {
    return this.rolesRepository.find({
      order: { id: 'ASC' },
    });
  }

  // =====================================================
  // CREAR USUARIO
  // =====================================================

  async create(dto: CreateUsersDto) {
    const idCard = dto.id_card.trim();
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();
    const jobPosition = dto.job_position.trim();

    const existing = await this.usersRepository.findOne({
      where: [
        { id_card: idCard },
        { email },
      ],
    });

    if (existing) {
      throw new ConflictException(
        'El documento o correo electrónico ya está registrado.',
      );
    }

    const role = await this.rolesRepository.findOne({
      where: { id: dto.role_id },
    });

    if (!role) {
      throw new BadRequestException('El rol seleccionado no existe.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.usersRepository.create({
      id_card: idCard,
      name,
      email,
      job_position: jobPosition,
      password: hashedPassword,
      role,
    });

    const saved = await this.usersRepository.save(user);

    return {
      message: 'Usuario creado correctamente.',
      user: {
        id: saved.id,
        id_card: saved.id_card,
        name: saved.name,
        email: saved.email,
        job_position: saved.job_position,
        role_id: role.id,
        role: {
          id: role.id,
          name: role.name,
        },
      },
    };
  }

  // =====================================================
  // EDITAR USUARIO
  // =====================================================

  async update(id: number, dto: UpdateUsersDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (dto.id_card !== undefined) {
      user.id_card = dto.id_card.trim();
    }

    if (dto.name !== undefined) {
      user.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      user.email = dto.email.trim().toLowerCase();
    }

    if (dto.job_position !== undefined) {
      user.job_position = dto.job_position.trim();
    }

    if (dto.role_id !== undefined) {
      const role = await this.rolesRepository.findOne({
        where: { id: dto.role_id },
      });

      if (!role) {
        throw new BadRequestException('El rol seleccionado no existe.');
      }
      user.role = role;
    }

    // Solo se modifica la contraseña si se envía una nueva.
    if (dto.password?.trim()) {
      if (dto.password.length < 8) {
        throw new BadRequestException(
          'La contraseña debe tener al menos 8 caracteres.',
        );
      }

      user.password = await bcrypt.hash(dto.password, 12);
    }

    try {
      await this.usersRepository.save(user);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'El documento o correo electrónico ya está registrado.',
        );
      }
      throw error;
    }

    const updated = await this.usersRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!updated) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return {
      message: 'Usuario actualizado correctamente.',
      user: {
        id: updated.id,
        id_card: updated.id_card,
        name: updated.name,
        email: updated.email,
        job_position: updated.job_position,
        role_id: updated.role?.id,
        role: updated.role
          ? {
            id: updated.role.id,
            name: updated.role.name,
          }
          : null,
      },
    };
  }

  // =====================================================
  // ELIMINAR USUARIO
  // =====================================================

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    try {
      await this.usersRepository.remove(user);
    } catch (error: any) {
      if (
        error.code === 'ER_ROW_IS_REFERENCED_2' ||
        error.code === 'ER_ROW_IS_REFERENCED'
      ) {
        throw new ConflictException(
          'No se puede eliminar este usuario porque tiene registros relacionados.',
        );
      }
      throw error;
    }
    return {
      message: 'Usuario eliminado correctamente.',
    };
  }
  // =====================================================
  // OBTENER PERFIL
  // =====================================================

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }
    return this.formatUser(user);
  }

  // =====================================================
  // ACTUALIZAR PERFIL
  // =====================================================

  async updateProfile(userId: number, dto: UpdateProfileDto,) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const hasChanges =
      dto.name !== undefined ||
      dto.email !== undefined ||
      dto.job_position !== undefined;

    if (!hasChanges) {
      throw new BadRequestException(
        'Debes enviar al menos un campo para actualizar',
      );
    }

    if (dto.name !== undefined) {
      const name = dto.name.trim();

      if (!name) {
        throw new BadRequestException(
          'El nombre no puede estar vacío',
        );
      }
      user.name = name;
    }

    if (dto.job_position !== undefined) {
      const jobPosition = dto.job_position.trim();

      if (!jobPosition) {
        throw new BadRequestException(
          'El cargo no puede estar vacío',
        );
      }
      user.job_position = jobPosition;
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();

      if (!email) {
        throw new BadRequestException(
          'El correo no puede estar vacío',
        );
      }

      const existingUser =
        await this.usersRepository.findOne({
          where: { email },
        });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException(
          'El correo electrónico ya está registrado',
        );
      }
      user.email = email;
    }

    const updatedUser =
      await this.usersRepository.save(user);

    // Consultar nuevamente para devolver el perfil
    // con la relación del rol correctamente cargada.
    const result = await this.usersRepository.findOne({
      where: { id: updatedUser.id },
      relations: { role: true },
    });

    if (!result) {
      throw new NotFoundException(
        'No se pudo recuperar el perfil actualizado',
      );
    }

    return {
      message: 'Perfil actualizado correctamente',
      user: this.formatUser(result),
    };
  }

  // =====================================================
  // CAMBIAR CONTRASEÑA
  // =====================================================


  async changePassword( userId: number, dto: ChangePasswordDto,) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException( 'Usuario no encontrado.',);
    }

    // Validar la contraseña actual.
    const passwordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'La contraseña actual es incorrecta.',
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      12,
    );

    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return {
      message: 'Contraseña actualizada correctamente.',
    };
  }
}
