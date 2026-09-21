import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
