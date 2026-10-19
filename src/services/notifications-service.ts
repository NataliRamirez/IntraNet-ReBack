import {Injectable,NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Notifications } from '../entities/notifications-entity';
import { Users } from '../entities/users-entity';
import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) { }

  // =====================================================
  // CREAR NOTIFICACIONES
  // =====================================================

  async create(
    actorUserId: number,
    entityType: NotificationEntity,
    action: NotificationAction,
    referenceId: number,
    entityName: string,
    link: string,
  ) {

    const actor = await this.usersRepository.findOne({where: { id: actorUserId }, relations: ['role']});

    if (!actor) {
      throw new NotFoundException('No se encontró el usuario que realizó la acción',);
    }

    // ¿Es contenido (noticia/evento)?
    const isContent =
      entityType === NotificationEntity.NEWS ||
      entityType === NotificationEntity.EVENT;

    // Roles que reciben la notificación interna
    const allowedRoles = isContent
      ? [UserRole.ADMINISTRADOR, UserRole.COMUNICACIONES]
      : [UserRole.ADMINISTRADOR];

    const staff = await this.usersRepository.find({
      where: {
        role: { name: In(allowedRoles),},
      },
      relations: ['role'],
    });

    // El actor no recibe su propia notificación
    const recipients = staff.filter((user) => user.id !== actorUserId,);

    // Texto según el tipo de entidad
    let entityText = 'usuario';

    if (entityType === NotificationEntity.NEWS) {
      entityText = 'noticia';
    } else if (entityType === NotificationEntity.EVENT) {
      entityText = 'evento';
    } else if (entityType === NotificationEntity.EMPLOYEE) {
      entityText = 'empleado';
    }

    // Título y mensaje según la acción
    let title = '';
    let message = '';

    switch (action) {
      case NotificationAction.CREATED:
        title = `Se creó un ${entityText}`;
        message = `${actor.name} creó el ${entityText} "${entityName}".`;
        break;

      case NotificationAction.UPDATED:
        title = `Se modificó un ${entityText}`;
        message = `${actor.name} modificó el ${entityText} "${entityName}".`;
        break;

      case NotificationAction.DELETED:
        title = `Se eliminó un ${entityText}`;
        message = `${actor.name} eliminó el ${entityText} "${entityName}".`;
        break;
    }

    // Notificaciones internas (una por destinatario)
    const notifications = recipients.map((recipient) =>
      this.notificationsRepository.create({
        user_id: recipient.id,
        actor_user_id: actor.id,
        entity_type: entityType,
        action,
        reference_id: referenceId,
        title,
        message,
        link,
        is_read: false,
      }),
    );

    // Notificación pública: solo cuando se crea una noticia o evento
    if (isContent && action === NotificationAction.CREATED) {
      notifications.push(
        this.notificationsRepository.create({
          user_id: null,
          actor_user_id: null,
          entity_type: entityType,
          action,
          reference_id: referenceId,
          title: `Nuevo ${entityText} publicado`,
          message: `Se publicó el ${entityText} "${entityName}".`,
          link,
          is_read: false,
        }),
      );
    }

    if (notifications.length === 0) {
      return [];
    }

    return this.notificationsRepository.save(notifications);
  }

  // =====================================================
  // OBTENER TODAS LAS NOTIFICACIONES
  // =====================================================

  async findAll(userId?: number) {
    const query = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.actor', 'actor');

    if (userId !== undefined && userId !== null) {
      query.where(
        '(notification.user_id IS NULL OR notification.user_id = :userId)',
        { userId },
      );
    } else {
      query.where('notification.user_id IS NULL');
    }

    return query.orderBy('notification.created_at', 'DESC').getMany();
  }

  // =====================================================
  // MARCAR UNA COMO LEÍDA
  // =====================================================

  async markAsRead(id: number, userId: number) {
    const notification =
      await this.notificationsRepository.findOne({
        where: { id },
      });

    if (!notification) {
      throw new NotFoundException('No se encontró la notificación',);
    }

    // Si es privada, solo puede modificarla su dueño
    if (notification.user_id !== null && notification.user_id !== userId) {
      throw new NotFoundException('No se encontró la notificación',);
    }

    notification.is_read = true;

    return this.notificationsRepository.save(notification);
  }

  // =====================================================
  // MARCAR TODAS COMO LEÍDAS
  // =====================================================

  async markAllAsRead(userId: number) {
    await this.notificationsRepository.update(
      {user_id: userId, is_read: false,},
      {is_read: true,},
    );

    return {message:'Todas las notificaciones fueron marcadas como leídas',};
  }

  // =====================================================
  // ELIMINAR UNA NOTIFICACIÓN
  // =====================================================

  async remove(id: number, userId: number) {
    const notification =
      await this.notificationsRepository.findOne({
        where: {id,user_id: userId,},
      });

    if (!notification) {
      throw new NotFoundException('No se encontró la notificación',);
    }

    await this.notificationsRepository.remove(notification);
    return {message: 'Notificación eliminada correctamente',};
  }
}