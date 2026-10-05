import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Users } from './users-entity';
import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id!: number;

  // Usuario que recibe la notificación.
  // NULL = notificación pública para todos.
  @Column({
    type: 'int',
    nullable: true,
  })
  user_id!: number | null;

  // Usuario que realizó la acción.
  @Column({
    type: 'int',
  })
  actor_user_id!: number;

  // Tipo de contenido afectado.
  @Column({
    type: 'enum',
    enum: NotificationEntity,
  })
  entity_type!: NotificationEntity;

  // Acción realizada.
  @Column({
    type: 'enum',
    enum: NotificationAction,
  })
  action!: NotificationAction;

  // ID de la noticia o evento.
  @Column({
    type: 'int',
  })
  reference_id!: number;

  // Título de la notificación.
  @Column({
    type: 'varchar',
    length: 255,
  })
  title!: string;

  // Mensaje de la notificación.
  @Column({
    type: 'text',
  })
  message!: string;

  // Enlace opcional.
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  link!: string | null;

  // Estado de lectura.
  @Column({
    type: 'boolean',
    default: false,
  })
  is_read!: boolean;

  // Fecha de creación.
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  // Usuario que recibe la notificación.
  @ManyToOne(
    () => Users,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'user_id',
  })
  user!: Users | null;

  // Usuario que realizó la acción.
  @ManyToOne(
    () => Users,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'actor_user_id',
  })
  actor!: Users;
}