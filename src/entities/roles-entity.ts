import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Users } from './users-entity';

@Entity('roles')
export class Roles {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    name!: string;

    @OneToMany(
        () => Users,
        (users) => users.role,
    )
    users!: Users[];
}