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
  id: number;

  @Column()
  type: 'news' | 'event';

  @Column()
  reference_id: number;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
