import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../entities/event-entity';

import { EventsService } from '../services/events-service';

import { EventsController } from '../controllers/events-controller';

import { NotificationsModule } from './notifications-module';

/**
 * Módulo encargado de la gestión de eventos.
 *
 * Permisos:
 * - Consulta de eventos: pública.
 * - Crear eventos: ADMINISTRADOR y COMUNICACIONES.
 * - Editar eventos: ADMINISTRADOR y COMUNICACIONES.
 * - Eliminar eventos: ADMINISTRADOR y COMUNICACIONES.
 *
 * Además, integra el módulo de notificaciones para generar
 * notificaciones cuando se crean o modifican eventos.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
    ]),

    NotificationsModule,
  ],

  providers: [
    EventsService,
  ],

  controllers: [
    EventsController,
  ],

  exports: [
    EventsService,
  ],
})
export class EventsModule {}