import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entities/news.entity';
import { NewsService } from '../services/news.service';
import { NewsController } from '../controllers/news.controller';
import { NotificationsModule } from '../modules/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    NotificationsModule, // 👈 ahora sí queda registrado
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
