import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

interface JwtPayload {
  sub: number;
  email: string;
  role: 'ADMINISTRADOR' | 'COMUNICACIONES';
}

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy) {

  constructor(
    private readonly configService: ConfigService,
  ) {

    const jwtSecret =
      configService.get<string>(
        'JWT_SECRET',
      );

    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET no está definido en el archivo .env',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: jwtSecret,
    });
  }

  async validate(
    payload: JwtPayload,
  ) {

    return {
      id: payload.sub,

      email: payload.email,

      role: payload.role,
    };
  }
}