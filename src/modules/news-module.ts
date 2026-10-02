import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { News } from '../entities/news-entity';

import { NewsService } from '../services/news-service';

import { NewsController } from '../controllers/news-controller';

import { NotificationsModule } from './notifications-module';

/**
 * Módulo encargado de la gestión de noticias.
 *
 * Permisos:
 * - Consulta de noticias: pública.
 * - Crear noticias: ADMINISTRADOR y COMUNICACIONES.
 * - Editar noticias: ADMINISTRADOR y COMUNICACIONES.
 * - Eliminar noticias: ADMINISTRADOR y COMUNICACIONES.
 *
 * Además, integra el módulo de notificaciones para generar
 * notificaciones cuando se crean o modifican noticias.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      News,
    ]),

    NotificationsModule,
  ],

  controllers: [
    NewsController,
  ],

  providers: [
    NewsService,
  ],
})
export class NewsModule {}