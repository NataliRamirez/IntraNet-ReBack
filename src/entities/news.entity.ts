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
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shortDesc?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image?: string;

  @Column({ type: 'datetime' })
  publicationDate: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
