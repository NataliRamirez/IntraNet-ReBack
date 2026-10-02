import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from '../entities/event-entity';

import { CreateEventDto } from '../DTOs/create-event-dto';
import { UpdateEventDto } from '../DTOs/update-event-dto';

import { NotificationsService } from './notifications-service';

import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,

    private readonly notificationsService: NotificationsService,
  ) {}

  // =====================================================
  // OBTENER TODOS
  // =====================================================

  async findAll() {
    return this.eventsRepository.find({
      order: {
        date_time: 'ASC',
      },
    });
  }

  // =====================================================
  // OBTENER UNO
  // =====================================================

  async findOne(id: number) {
    const event =
      await this.eventsRepository.findOne({
        where: {
          id,
        },
      });

    if (!event) {
      throw new NotFoundException(
        'No se encontró el evento',
      );
    }

    return event;
  }

  // =====================================================
  // CREAR
  // =====================================================

  async create(
    createEventDto: CreateEventDto,
    actorUser: any,
  ) {
    const event =
      this.eventsRepository.create(
        createEventDto,
      );

    const savedEvent =
      await this.eventsRepository.save(
        event,
      );

    // Crear notificaciones para administradores
    await this.notificationsService.create(
      actorUser.id,

      NotificationEntity.EVENT,

      NotificationAction.CREATED,

      savedEvent.id,

      savedEvent.name,

      `/events/${savedEvent.id}`,
    );

    return savedEvent;
  }

  // =====================================================
  // EDITAR
  // =====================================================

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    actorUser: any,
  ) {
    const event =
      await this.eventsRepository.findOne({
        where: {
          id,
        },
      });

    if (!event) {
      throw new NotFoundException(
        'No se encontró el evento',
      );
    }

    Object.assign(
      event,
      updateEventDto,
    );

    const updatedEvent =
      await this.eventsRepository.save(
        event,
      );

    // Crear notificación
    await this.notificationsService.create(
      actorUser.id,

      NotificationEntity.EVENT,

      NotificationAction.UPDATED,

      updatedEvent.id,

      updatedEvent.name,

      `/events/${updatedEvent.id}`,
    );

    return updatedEvent;
  }

  // =====================================================
  // ELIMINAR
  // =====================================================

  async remove(
    id: number,
    actorUser: any,
  ) {
    const event =
      await this.eventsRepository.findOne({
        where: {
          id,
        },
      });

    if (!event) {
      throw new NotFoundException(
        'No se encontró el evento',
      );
    }

    // Guardamos los datos antes de eliminar
    const eventId = event.id;
    const eventName = event.name;

    await this.eventsRepository.remove(
      event,
    );

    // Crear notificación después de eliminar
    await this.notificationsService.create(
      actorUser.id,

      NotificationEntity.EVENT,

      NotificationAction.DELETED,

      eventId,

      eventName,

      '/events',
    );

    return {
      message:
        'Evento eliminado correctamente',
    };
  }
}