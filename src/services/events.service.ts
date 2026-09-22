import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../DTOs/create-event.dto';
import { UpdateEventDto } from '../DTOs/update-event.dto';
import { NotificationsService } from './notifications.service';

/**
 * Servicio encargado de la gestión de eventos.
 *
 * Proporciona la lógica de negocio necesaria para administrar los eventos publicados en la Intranet, 
 * incluyendo operaciones de consulta, creación, actualización y eliminación.
 *
 * Además, genera automáticamente una notificación cuando se registra un nuevo evento en el sistema.
 */
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Obtiene todos los eventos registrados.
   *
   * Los resultados se ordenan de forma descendente según la fecha y hora del evento.
   *
   * @returns {Promise<Event[]>}
   * Lista de eventos registrados.
   */
  findAll() {
    return this.repo.find({ order: { dateTime: 'DESC' } });
  }

   /**
   * Obtiene un evento específico mediante su identificador.
   *
   * @param {number} id Identificador único del evento.
   * @returns {Promise<Event>} Información del evento encontrado.
   * @throws {NotFoundException} Si el evento no existe.
   */
  async findOne(id: number) {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  /**
   * Crea un nuevo evento en el sistema.
   *
   * Después de registrar el evento, genera automáticamente una notificación para informar a los 
   * usuarios sobre la nueva actividad programada.
   *
   * @param {CreateEventDto} dto Datos necesarios para crear el evento.
   * @returns {Promise<Event>} Evento creado exitosamente.
   */
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

   /**
   * Actualiza la información de un evento existente.
   *
   * Verifica previamente la existencia del evento antes de realizar la actualización.
   *
   * @param {number} id Identificador del evento.
   * @param {UpdateEventDto} dto Datos que serán actualizados.
   * @returns {Promise<Event>} Evento actualizado.
   * @throws {NotFoundException} Si el evento no existe.
   */
  async update(id: number, dto: UpdateEventDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

   /**
   * Elimina un evento del sistema.
   *
   * Verifica previamente que el evento exista antes de ejecutar la eliminación.
   *
   * @param {number} id Identificador del evento a eliminar.
   * @returns {Promise<{ deleted: boolean }>} Resultado de la operación de eliminación.
   * @throws {NotFoundException} Si el evento no existe.
   */
  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { deleted: true };
  }
}