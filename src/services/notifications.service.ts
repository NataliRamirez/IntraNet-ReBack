import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notifications.entity';

/**
 * Servicio encargado de la gestión de notificaciones.
 *
 * Proporciona la lógica de negocio necesaria para registrar, consultar y actualizar las notificaciones 
 * generadas por diferentes módulos de la Intranet, como noticias y eventos.
 */
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  /**
   * Crea una nueva notificación en el sistema.
   *
   * Permite registrar notificaciones asociadas a eventos o noticias para ser mostradas posteriormente a los usuarios.
   *
   * @param {{
   *  type: 'news' | 'event';
   *  reference_id: number;
   *  title: string;
   *  message: string;
   *  link?: string;
   * }} data Información de la notificación a registrar.
   *
   * @returns {Promise<Notification>} Notificación creada exitosamente.
   */
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
  
  /**
   * Obtiene todas las notificaciones registradas.
   *
   * Los resultados se ordenan de forma descendente según la fecha de creación, mostrando primero
   * las más recientes.
   *
   * @returns {Promise<Notification[]>} Lista de notificaciones registradas.
   */
  async findAll() {
    return this.notificationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

   /**
   * Marca una notificación como leída.
   *
   * Actualiza el estado de lectura de la notificación correspondiente al identificador recibido.
   *
   * @param {number} id Identificador de la notificación.
   * @returns {Promise<{ message: string }>} Mensaje de confirmación de la operación.
   */
  async markAsRead(id: number) {
    await this.notificationRepo.update(id, { read: true });
    return { message: `Notification ${id} marked as read` };
  }
}
