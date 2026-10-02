import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '../controllers/auth-controller';
import { AuthService } from '../services/auth-service';

import { JwtStrategy } from '../strategies/jwt-strategy';

import { Users } from '../entities/users-entity';

@Module({
  imports: [

    PassportModule,

    TypeOrmModule.forFeature([
      Users,
    ]),

    JwtModule.register({
      secret: process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '1h',
      },
    }),

  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}