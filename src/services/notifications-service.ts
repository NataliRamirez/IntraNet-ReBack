import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  ) {}

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
    // Buscar quién realizó la acción
    const actor = await this.usersRepository.findOne({
      where: {
        id: actorUserId,
      },
      relations: ['role'],
    });

    if (!actor) {
      throw new NotFoundException(
        'No se encontró el usuario que realizó la acción',
      );
    }

    // Buscar todos los administradores
    const administrators =
      await this.usersRepository.find({
        where: {
          role: {
            name: UserRole.ADMINISTRADOR,
          },
        },
        relations: ['role'],
      });

    // Si no hay administradores, no se crea nada
    if (administrators.length === 0) {
      return [];
    }

    // Si el actor es administrador,
    // no se le envía la notificación a sí mismo.
    const recipients =
      administrators.filter(
        (user) => user.id !== actorUserId,
      );

    // Generar información de la notificación
    const entityText =
      entityType === NotificationEntity.NEWS
        ? 'noticia'
        : 'evento';

    let title = '';
    let message = '';

    switch (action) {
      case NotificationAction.CREATED:
        title = `${entityText} creada`;
        message =
          `${actor.name} creó la ${entityText} "${entityName}".`;
        break;

      case NotificationAction.UPDATED:
        title = `${entityText} modificada`;
        message =
          `${actor.name} modificó la ${entityText} "${entityName}".`;
        break;

      case NotificationAction.DELETED:
        title = `${entityText} eliminada`;
        message =
          `${actor.name} eliminó la ${entityText} "${entityName}".`;
        break;
    }

    const notifications =
      recipients.map((recipient) =>
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

    if (notifications.length === 0) {
      return [];
    }

    return this.notificationsRepository.save(
      notifications,
    );
  }

  // =====================================================
  // OBTENER TODAS
  // =====================================================

  async findAll() {
    return this.notificationsRepository.find({
      relations: {
        actor: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  // =====================================================
  // MARCAR UNA COMO LEÍDA
  // =====================================================

  async markAsRead(
    id: number,
    userId: number,
  ) {
    const notification =
      await this.notificationsRepository.findOne({
        where: {
          id,
          user_id: userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'No se encontró la notificación',
      );
    }

    notification.is_read = true;

    return this.notificationsRepository.save(
      notification,
    );
  }

  // =====================================================
  // MARCAR TODAS COMO LEÍDAS
  // =====================================================

  async markAllAsRead(
    userId: number,
  ) {
    await this.notificationsRepository.update(
      {
        user_id: userId,
        is_read: false,
      },
      {
        is_read: true,
      },
    );

    return {
      message:
        'Todas las notificaciones fueron marcadas como leídas',
    };
  }

  // =====================================================
  // ELIMINAR UNA NOTIFICACIÓN
  // =====================================================

  async remove(
    id: number,
    userId: number,
  ) {
    const notification =
      await this.notificationsRepository.findOne({
        where: {
          id,
          user_id: userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'No se encontró la notificación',
      );
    }

    await this.notificationsRepository.remove(
      notification,
    );

    return {
      message:
        'Notificación eliminada correctamente',
    };
  }
}