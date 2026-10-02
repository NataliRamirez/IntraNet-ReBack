import {
  Injectable,
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
   * Busca el usuario en MySQL
   * y verifica su contraseña.
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Users | null> {

    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['role'],
    });

    if (!user) {
      return null;
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordValid) {
      return null;
    }

    return user;
  }

  /**
   * Genera el JWT.
   */
  async login(user: Users) {

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
   * Verifica una contraseña contra un hash.
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {

    return bcrypt.compare(
      password,
      hashedPassword,
    );
  }
}