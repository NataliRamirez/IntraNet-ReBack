import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { Users } from '../entities/users-entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  /**
   * Busca al usuario por correo y verifica su contraseña.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Users | null> {
    if (
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      return null;
    }

    // Incluimos explícitamente la contraseña porque
    // en la entidad tiene select: false.
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', {
        email: email.trim(),
      })
      .getOne();

    if (!user || !user.password) {
      return null;
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordValid) {
      return null;
    }

    // No devolver el hash en el objeto validado.
    user.password = '';

    return user;
  }

  /**
   * Genera el JWT del usuario autenticado.
   */
  async login(user: Users) {
    if (!user.role) {
      throw new UnauthorizedException(
        'El usuario no tiene un rol asignado.',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Verifica una contraseña contra un hash existente.
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (
      !password ||
      typeof password !== 'string' ||
      !hashedPassword ||
      typeof hashedPassword !== 'string'
    ) {
      return false;
    }

    return bcrypt.compare(password, hashedPassword);
  }
}