import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from 'typeorm';

@Entity('terms_acceptance')
export class TermsAcceptance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'terms_version', type: 'varchar',length: 30,})
  termsVersion!: string;

  @Column({type: 'boolean',default: true,})
  accepted!: boolean;

  @Column({name: 'ip_address',type: 'varchar',length: 45,nullable: true,})
  ipAddress!: string | null;

  @Column({name: 'user_agent',type: 'text',nullable: true, })
  userAgent!: string | null;

  @CreateDateColumn({name: 'accepted_at',type: 'timestamp',})
  acceptedAt!: Date;
}
