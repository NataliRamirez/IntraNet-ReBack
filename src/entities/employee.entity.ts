import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empleados')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100 })
  cargo: string;

  @Column({ length: 100 })
  area: string;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;
}
