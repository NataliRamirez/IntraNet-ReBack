import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { EventsModule } from './events/events.module';
import { EmployeeModule } from './modules/employee.module';
import { NewsModule } from './news/news.module';
import { NotificationsModule } from './modules/notifications.module';
import { BirthdayImageModule } from './modules/birthday-image.module';

@Module({
  imports: [
    // 🖼 Servir carpeta "public"
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/uploads'],
    }),

    // 🖼 Servir carpeta "uploads" (donde guardamos imágenes)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // <-- Esto hace que sea accesible vía URL
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'emca',
      database: process.env.DB_NAME || 'intranet_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),

    EventsModule,
    EmployeeModule,
    NewsModule,
    NotificationsModule,
    BirthdayImageModule,
  ],
})
export class AppModule {}
