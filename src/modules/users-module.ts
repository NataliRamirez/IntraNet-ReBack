import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../entities/users-entity';

import { UsersController } from '../controllers/users-controller';

import { UsersService } from '../services/users-service';

/**
 * Módulo encargado de la gestión del perfil de los usuarios.
 *
 * Los endpoints del perfil requieren autenticación mediante JWT.
 *
 * Cada usuario autenticado puede administrar únicamente
 * la información de su propio perfil.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
    ]),
  ],

  controllers: [
    UsersController,
  ],

  providers: [
    UsersService,
  ],

  exports: [
    UsersService,
  ],
})
export class UsersModule {}