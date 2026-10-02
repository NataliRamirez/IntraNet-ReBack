import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';

import { Users } from './users-entity';

@Entity('notifications')
export class Notifications {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  user_id!: number;

  @Column({
    type: 'int',
  })
  actor_user_id!: number;

  @Column({
    type: 'enum',
    enum: NotificationEntity,
  })
  entity_type!: NotificationEntity;

  @Column({
    type: 'enum',
    enum: NotificationAction,
  })
  action!: NotificationAction;
  
  @Column({
    type: 'int',
  })
  reference_id!: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title!: string;

  @Column({
    type: 'text',
  })
  message!: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  link!: string | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_read!: boolean;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @ManyToOne(
    () => Users,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'user_id',
  })
  user!: Users;

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