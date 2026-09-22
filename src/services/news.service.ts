import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../entities/news.entity';
import { CreateNewsDto } from '../DTOs/create-news.dto';
import { UpdateNewsDto } from '../DTOs/update-news.dto';
import { NotificationsService } from './notifications.service';

/**
 * Servicio encargado de la gestión de noticias.
 *
 * Proporciona la lógica de negocio necesaria para administrar las noticias publicadas en la Intranet, 
 * incluyendo operaciones de consulta, creación, actualización y eliminación.
 *
 * Además, genera automáticamente una notificación cuando se publica una nueva noticia para informar a los usuarios.
 */
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Obtiene todas las noticias registradas.
   *
   * Los resultados se ordenan de forma descendente según la fecha de publicación.
   *
   * @returns {Promise<News[]>} Lista de noticias registradas.
   */
  async findAll() {
    return this.newsRepository.find({
      order: { publicationDate: 'DESC' },
    });
  }

  /**
   * Obtiene una noticia específica mediante su identificador.
   *
   * @param {number} id Identificador único de la noticia.
   *
   * @returns {Promise<News>} Información de la noticia encontrada.
   *
   * @throws {NotFoundException} Si la noticia no existe.
   */
  async findOne(id: number) {
    const new = await this.newsRepository.findOne({ where: { id } });
    if (!new) throw new NotFoundException('Noticia no encontrada');
    return new;
  }

   /**
   * Crea una nueva noticia en el sistema.
   *
   * Después de registrar la noticia, genera automáticamente una notificación para informar a los 
   * usuarios sobre la nueva publicación.
   *
   * @param {CreateNewsDto} data Datos necesarios para crear la noticia.
   * @returns {Promise<News>} Noticia creada exitosamente.
   */
  async create(data: CreateNewsDto): Promise<News> {
    const new = this.newsRepository.create({
      title: data.title,
      shortDesc: data.shortDesc,
      content: data.content,
      image: data.image || undefined,
      publicationDate: data.publicationDate,
    });

    const saved = await this.newsRepository.save(new);

    // 🛎️ Crear notificación
    await this.notificationsService.create({
      type: 'news',
      reference_id: saved.id,
      title: 'Nueva noticia publicada',
      message: data.title,
      link: `/news/${saved.id}`,
    });

    return saved;
  }

  /**
   * Actualiza la información de una noticia existente.
   *
   * @param {number} id Identificador de la noticia.
   * @param {UpdateNewsDto} data Datos que serán actualizados.
   * @returns {Promise<News>} Noticia actualizada.
   * @throws {NotFoundException} Si la noticia no existe.
   */
  async update(id: number, data: UpdateNewsDto) {
    await this.newsRepository.update(id, data);
    return this.findOne(id);
  }

  /**
   * Elimina una noticia del sistema.
   *
   * Verifica previamente que la noticia exista antes de ejecutar la eliminación.
   *
   * @param {number} id Identificador de la noticia a eliminar.
   * @returns {Promise<{ message: string }>} Mensaje de confirmación de la operación.
   * @throws {NotFoundException} Si la noticia no existe.
   */
  async remove(id: number) {
    const news = await this.findOne(id);
    await this.newsRepository.delete(news.id);
    return { message: 'Noticia eliminada correctamente' };
  }
}
