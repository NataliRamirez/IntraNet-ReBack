import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { News } from '../entities/news-entity';

import { CreateNewsDto } from '../DTOs/create-news-dto';
import { UpdateNewsDto } from '../DTOs/update-news-dto';

import { NotificationsService } from './notifications-service';

import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

    private readonly notificationsService: NotificationsService,
  ) {}

  // =====================================================
  // OBTENER TODAS
  // =====================================================

  async findAll() {
    return this.newsRepository.find({
      order: {
        publication_date: 'DESC',
      },
    });
  }

  // =====================================================
  // OBTENER UNA
  // =====================================================

  async findOne(id: number) {
    const news =
      await this.newsRepository.findOne({
        where: {
          id,
        },
      });

    if (!news) {
      throw new NotFoundException(
        'No se encontró la noticia',
      );
    }

    return news;
  }

  // =====================================================
  // CREAR
  // =====================================================

  async create(
    createNewsDto: CreateNewsDto,
    actorUser: any,
  ) {
    const news =
      this.newsRepository.create(
        createNewsDto,
      );

    const savedNews =
      await this.newsRepository.save(news);

    // Crear notificaciones para administradores
    await this.notificationsService.create(
      actorUser.id,

      NotificationEntity.NEWS,

      NotificationAction.CREATED,

      savedNews.id,

      savedNews.title,

      `/news/${savedNews.id}`,
    );

    return savedNews;
  }

  // =====================================================
  // EDITAR
  // =====================================================

  async update(
    id: number,
    updateNewsDto: UpdateNewsDto,
    actorUser: any,
  ) {
    const news =
      await this.newsRepository.findOne({
        where: {
          id,
        },
      });

    if (!news) {
      throw new NotFoundException(
        'No se encontró la noticia',
      );
    }

    Object.assign(
      news,
      updateNewsDto,
    );

    const updatedNews =
      await this.newsRepository.save(
        news,
      );

    // Crear notificación
    await this.notificationsService.create(
      actorUser.id,

      NotificationEntity.NEWS,

      NotificationAction.UPDATED,

      updatedNews.id,

      updatedNews.title,

      `/news/${updatedNews.id}`,
    );

    return updatedNews;
  }

  // =====================================================
  // ELIMINAR
  // =====================================================

  async remove(
    id: number,
    actorUser: any,
  ) {
    const news =
      await this.newsRepository.findOne({
        where: {
          id,
        },
      });

    if (!news) {
      throw new NotFoundException(
        'No se encontró la noticia',
      );
    }

    // Guardamos estos datos antes de eliminar
    const newsId = news.id;
    const newsTitle = news.title;

    await this.newsRepository.remove(
      news,
    );

    // Crear notificación después de eliminar
    await this.notificationsService.create(
      actorUser.id,

      NotificationEntity.NEWS,

      NotificationAction.DELETED,

      newsId,

      newsTitle,

      '/news',
    );

    return {
      message:
        'Noticia eliminada correctamente',
    };
  }
}