import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(data: {
    type: 'news' | 'event';
    reference_id: number;
    title: string;
    message: string;
    link?: string;
  }) {
    const newNotification = this.notificationRepo.create(data);
    return this.notificationRepo.save(newNotification);
  }
  
  async findAll() {
    return this.notificationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(id: number) {
    await this.notificationRepo.update(id, { read: true });
    return { message: `Notification ${id} marked as read` };
  }
}
