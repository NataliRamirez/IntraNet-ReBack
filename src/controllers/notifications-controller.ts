import {
  Controller,
  Get,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';

import { NotificationsService } from '../services/notifications-service';

/**
 * Controlador encargado de la consulta y actualización
 * de las notificaciones del sistema.
 *
 * Las notificaciones pueden ser consultadas por todos
 * los usuarios, estén autenticados o no.
 *
 * Las notificaciones no se crean directamente mediante
 * este controlador. Son generadas automáticamente por
 * los módulos de Noticias y Eventos.
 */
@Controller('notifications')
export class NotificationsController {

  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Obtiene todas las notificaciones registradas.
   *
   * Disponible para todos los usuarios.
   *
   * Endpoint:
   * GET /notifications
   */
  @Get()
  @HttpCode(200)
  getAll() {

    return this.notificationsService.findAll();
  }

  /**
   * Marca una notificación como leída.
   *
   * Endpoint:
   * PATCH /notifications/:id/is_read
   */
  @Patch(':id/is_read')
  @HttpCode(200)
  markAsRead(
    @Param('id') id: number,
  ) {

    return this.notificationsService.markAsRead(id);
  }
}