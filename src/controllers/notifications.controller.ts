import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

/**
 * Controlador encargado de la gestión de notificaciones del sistema.
 *
 * Permite consultar todas las notificaciones registradas, crear nuevas notificaciones y marcar una notificación
 * específica como leída.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

    /**
   * Obtiene todas las notificaciones registradas.
   *
   * Endpoint: GET /notifications
   *
   * @returns Lista de notificaciones almacenadas.
   */
  @Get()
  getAll() {
    return this.notificationsService.findAll();
  }

  /**
   * Crea una nueva notificación.
   *
   * Endpoint: POST /notifications
   *
   * @param body Información de la notificación a registrar.
   * @param body.type Tipo de referencia asociada a la notificación ('news' para noticias o 'event' para eventos).
   * @param body.reference_id Identificador del recurso relacionado.
   * @param body.title Título de la notificación.
   * @param body.message Mensaje descriptivo de la notificación.
   * @param body.link Enlace opcional asociado a la notificación.
   *
   * @returns La notificación creada.
   * */
  @Post()
  create(
    @Body()
    body: {
      type: 'news' | 'event';
      reference_id: number;
      title: string;
      message: string;
      link?: string;
    }
  ) {
    return this.notificationsService.create(body);
  }

  /**
   * Marca una notificación como leída.
   *
   * Endpoint: PATCH /notifications/:id/read
   *
   * @param id Identificador único de la notificación.
   *
   * @returns La notificación actualizada con estado de lectura.
   */
  @Patch(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.notificationsService.markAsRead(id);
  }
}
