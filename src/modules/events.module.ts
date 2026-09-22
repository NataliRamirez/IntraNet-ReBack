import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { EventsService } from '../services/events.service';
import { EventsController } from '../controllers/events.controller';
import { NotificationsModule } from '../modules/notifications.module';

/**
 * Módulo encargado de la gestión de eventos.
 *
 * Este módulo agrupa todos los componentes necesarios para administrar los eventos publicados en la Intranet,
 * incluyendo su creación, consulta, actualización y eliminación. Además, integra el módulo de notificaciones para
 * generar alertas automáticas cuando se registran o modifican eventos.
 *
 * Componentes:
 * - EventsController: Expone los endpoints relacionados con eventos.
 * - EventsService: Implementa la lógica de negocio de los eventos.
 * - Event: Entidad que representa los eventos en la base de datos.
 * - NotificationsModule: Permite la integración con el sistema de notificaciones.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    NotificationsModule, // <-- ESTA ES LA CLAVE
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
