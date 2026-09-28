import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entidad que representa una notificación dentro del sistema.
 *
 * Permite almacenar alertas relacionadas con noticias y eventos publicados en la Intranet, facilitando
 * su consulta y seguimiento por parte de los usuarios.
 */
@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: ['news', 'event'],
  })
  type!: 'news' | 'event';

  @Column({ type: 'int' })
  reference_id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link?: string;

  @Column({ type: 'boolean', default: false })
  read!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  createdAt!: Date;

}