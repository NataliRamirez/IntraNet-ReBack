import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../DTOs/create-event.dto';
import { UpdateEventDto } from '../DTOs/update-event.dto';
import { NotificationsService } from './notifications.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
    private readonly notificationsService: NotificationsService,
  ) {}

  findAll() {
    return this.repo.find({ order: { dateTime: 'DESC' } });
  }

  async findOne(id: number) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  async create(dto: CreateEventDto) {
    const saved = await this.repo.save(this.repo.create(dto));

    await this.notificationsService.create({
      type: 'event',
      reference_id: saved.id,
      title: 'Nuevo evento programado',
      message: dto.name,
    });

    return saved;
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { deleted: true };
  }
}
