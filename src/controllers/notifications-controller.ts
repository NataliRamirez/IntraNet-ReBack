import {Controller, Delete, Get, Param, Patch, Req, UseGuards,} from '@nestjs/common';

import { NotificationsService } from '../services/notifications-service';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth-guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) { }

  // ==========================================
  // PÚBLICO: CONSULTAR NOTIFICACIONES
  // ==========================================

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: any) {
    return this.notificationsService.findAll(req.user?.id);
  }

  // ==========================================
  // MARCAR TODAS LEIDAS
  // ==========================================

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  // ==========================================
  // USUARIOS AUTENTICADOS
  // MARCAR LEIDO
  // ==========================================

  @Patch(':id/is_read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.markAsRead(Number(id), req.user.id);
  }

  // ==========================================
  // USUARIOS AUTENTICADOS
  // BORRAR NOTIFICACION
  // ==========================================

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.remove(Number(id), req.user.id);
  }
}
