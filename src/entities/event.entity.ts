import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidad que representa un evento dentro del sistema.
 *
 * Almacena la información de los eventos publicados en la Intranet, incluyendo detalles, ubicación,
 * enlaces relacionados e imagen asociada.
 */
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  dateTime: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  place: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string;
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated: Date;
}
