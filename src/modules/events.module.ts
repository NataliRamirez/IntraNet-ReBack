import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { EventsService } from '../services/events.service';
import { EventsController } from '../controllers/events.controller';
import { NotificationsModule } from '../modules/notifications.module';

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
