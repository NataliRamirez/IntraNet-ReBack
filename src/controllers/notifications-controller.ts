import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from '../services/notifications-service';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) { }

  // ==========================================
  // PÚBLICO
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any) {
    return this.notificationsService.findAll(req.user.id);
  }

  // ==========================================
  // USUARIOS AUTENTICADOS
  // ==========================================

  @Patch(':id/is_read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.notificationsService.markAsRead(
      Number(id),
      req.user.id,
    );
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(
    @Req() req: any,
  ) {
    return this.notificationsService.markAllAsRead(
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.notificationsService.remove(
      Number(id),
      req.user.id,
    );
  }
}