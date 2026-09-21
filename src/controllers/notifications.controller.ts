import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll() {
    return this.notificationsService.findAll();
  }

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

  @Patch(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.notificationsService.markAsRead(id);
  }
}
