import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from '../entities/notifications-entity';

import { NotificationsService } from '../services/notifications-service';

import { NotificationsController } from '../controllers/notifications-controller';

/**
 * Módulo encargado de la gestión de notificaciones.
 *
 * Las notificaciones pueden ser consultadas y gestionadas
 * sin requerir autenticación.
 *
 * Este módulo es utilizado por otros módulos como:
 * - NewsModule
 * - EventsModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
    ]),
  ],

  controllers: [
    NotificationsController,
  ],

  providers: [
    NotificationsService,
  ],

  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}