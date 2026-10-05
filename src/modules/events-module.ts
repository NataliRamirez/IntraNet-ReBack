import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../entities/event-entity';

import { EventsController } from '../controllers/events-controller';
import { EventsService } from '../services/events-service';

import { NotificationsModule } from './notifications-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
    ]),

    NotificationsModule,
  ],

  controllers: [
    EventsController,
  ],

  providers: [
    EventsService,
  ],

  exports: [
    EventsService,
  ],
})
export class EventsModule {}