import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../entities/news.entity';
import { CreateNewsDto } from '../DTOs/create-news.dto';
import { UpdateNewsDto } from '../DTOs/update-news.dto';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll() {
    return this.newsRepository.find({
      order: { publicationDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const new = await this.newsRepository.findOne({ where: { id } });
    if (!new) throw new NotFoundException('Noticia no encontrada');
    return new;
  }

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

  async update(id: number, data: UpdateNewsDto) {
    await this.newsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const news = await this.findOne(id);
    await this.newsRepository.delete(news.id);
    return { message: 'Noticia eliminada correctamente' };
  }
}
