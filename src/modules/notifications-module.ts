import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notifications } from '../entities/notifications-entity';
import { Users } from '../entities/users-entity';

import { NotificationsController } from '../controllers/notifications-controller';
import { NotificationsService } from '../services/notifications-service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notifications,
      Users,
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