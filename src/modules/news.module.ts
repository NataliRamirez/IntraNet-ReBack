import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entities/news.entity';
import { NewsService } from '../services/news.service';
import { NewsController } from '../controllers/news.controller';
import { NotificationsModule } from '../modules/notifications.module';

/**
 * Módulo encargado de la gestión de noticias.
 *
 * Este módulo agrupa todos los componentes necesarios para administrar las noticias publicadas en la Intranet,
 * permitiendo su creación, consulta, actualización y eliminación. Además, integra el módulo de notificaciones 
 * para generar alertas automáticas cuando se publica o modifica una noticia.
 *
 * Componentes:
 * - NewsController: Expone los endpoints relacionados con noticias.
 * - NewsService: Implementa la lógica de negocio de las noticias.
 * - News: Entidad encargada de la persistencia de datos.
 * - NotificationsModule: Gestiona la creación de notificaciones.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    NotificationsModule, // 👈 ahora sí queda registrado
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
