import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '../controllers/auth-controller';
import { AuthService } from '../services/auth-service';
import { JwtStrategy } from '../strategies/jwt-strategy';

import { Users } from '../entities/users-entity';
import { Roles } from '../entities/roles-entity';

@Module({
  imports: [
    PassportModule,

    ConfigModule,

    TypeOrmModule.forFeature([
      Users,
      Roles,
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
        ),

        signOptions: {
          expiresIn: '1h',
        },
      }),
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