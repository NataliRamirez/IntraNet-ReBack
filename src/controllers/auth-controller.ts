import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../services/auth-service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body() body: {
      email: string;
      password: string;
    },
  ) {

    /*
     * Temporalmente estamos simulando
     * un usuario.
     *
     * Después lo conectaremos con MySQL.
     */

    const user = {
      id: 1,
      email: body.email,
      role: 'ADMIN',
    };

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    return this.authService.login(user);
  }
}