import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('employee')
export class Employee {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 10, unique: true })
  id_card!: string;

  @Column({ length: 100 })
  job_position!: string;

  @Column({ length: 100 })
  area!: string;

  @Column({ type: 'date' })
  birthday!: Date;

  @Column({type: 'varchar',length: 255,nullable: true,})
  image?: string;
}