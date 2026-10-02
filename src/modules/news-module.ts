import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { News } from '../entities/news-entity';

import { NewsController } from '../controllers/news-controller';
import { NewsService } from '../services/news-service';

import { NotificationsModule } from './notifications-module';

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

  exports: [
    NewsService,
  ],
})
export class NewsModule {}