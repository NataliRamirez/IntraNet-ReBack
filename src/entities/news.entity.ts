import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad que representa una noticia publicada dentro del sistema.
 *
 * Almacena la información de las noticias visibles en la Intranet, incluyendo título, descripción, contenido, imagen y fechas
 * de publicación y actualización.
 */
@Entity('news')
export class News {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({
    name: 'short_desc',
    type: 'text',
    nullable: true,
  })
  short_desc?: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  content?: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  image?: string;

  @Column({
    name: 'publication_date',
    type: 'datetime',
  })
  publication_date!: Date;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}