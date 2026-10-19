import {Column, Entity, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';
import { Users } from './users-entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar',length: 50,unique: true,})
  name!: string;

  @OneToMany(() => Users, (user) => user.role)
  users!: Users[];
}
