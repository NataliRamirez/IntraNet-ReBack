import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Roles } from './roles-entity';

@Entity('users')
export class Users {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        length: 15,
        unique: true,
    })
    id_card!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    email!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    password!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    job_position!: string;

    @Column({
        type: 'int',
    })
    role_id!: number;

    @ManyToOne(
        () => Roles,
        (roles) => roles.users,
    )
    @JoinColumn({
        name: 'role_id',
    })
    role!: Roles;
}