import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';

import { Users } from './users-entity';
import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id!: number;

  // Usuario que recibe la notificación.
  // NULL = notificación pública para todos.
  @Column({type: 'int', nullable: true,})
  user_id!: number | null;

  // Usuario que realizó la acción.
  // NULL = notificación pública (no se expone quién la publicó).
  @Column({type: 'int', nullable: true,})
  actor_user_id!: number | null;

  @Column({type: 'enum', enum: NotificationEntity,})
  entity_type!: NotificationEntity;

  @Column({type: 'enum', enum: NotificationAction,})
  action!: NotificationAction;

  // ID del elemento afectado (noticia, evento, usuario, empleado).
  @Column({type: 'int',})
  reference_id!: number;

  @Column({type: 'varchar',length: 255,})
  title!: string;

  @Column({type: 'text',})
  message!: string;

  @Column({type: 'varchar', length: 500, nullable: true,})
  link!: string | null;

  @Column({type: 'boolean',default: false,})
  is_read!: boolean;
  
  @Column({type: 'datetime',default: () => 'CURRENT_TIMESTAMP',})
  created_at!: Date;

  // Usuario que recibe la notificación.
  @ManyToOne(() => Users, {nullable: true,onDelete: 'CASCADE',})
  @JoinColumn({name: 'user_id',})
  user!: Users | null;

  // Usuario que realizó la acción.
  @ManyToOne(() => Users, {nullable: true,onDelete: 'SET NULL',})
  @JoinColumn({name: 'actor_user_id',})
  actor!: Users | null;
}