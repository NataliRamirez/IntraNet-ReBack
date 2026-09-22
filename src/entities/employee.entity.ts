import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad que representa a un empleado dentro del sistema.
 *
 * Almacena la información básica de los colaboradores registrados en la Intranet, incluyendo datos personales
 * y laborales.
 */
@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 20, unique: true })
  id_card: string;

  @Column({ length: 100 })
  job_position: string;

  @Column({ length: 100 })
  area: string;

  @Column({ type: 'date' })
  birthday: Date;
}
