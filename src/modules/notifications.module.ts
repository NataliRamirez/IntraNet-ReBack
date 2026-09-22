import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notifications.entity';
import { NotificationsService } from '../services/notifications.service';
import { NotificationsController } from '../controllers/notifications.controller';

/**
 * Módulo encargado de la gestión de notificaciones.
 *
 * Este módulo centraliza la administración de las notificaciones generadas por la Intranet, permitiendo
 * su creación, consulta y actualización de estado.
 *
 * Las notificaciones son utilizadas por otros módulos del sistema, como Noticias y Eventos.
 *
 * Componentes:
 * - NotificationsController: Expone los endpoints relacionados con las notificaciones.
 * - NotificationsService: Implementa la lógica de negocio.
 * - Notification: Entidad encargada de la persistencia de datos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
