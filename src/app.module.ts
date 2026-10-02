import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';

import { EventsModule } from './modules/events-module';

import { EmployeeModule } from './modules/employee-module';

import { NewsModule } from './modules/news-module';

import { NotificationsModule } from './modules/notifications-module';

import { BirthdayImageModule } from './modules/birthdayImage-module';

import { AuthModule } from './modules/auth-module';


@Module({

  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),


    TypeOrmModule.forRoot({

      type: 'mysql',

      host: 'localhost',

      port: 3306,

      username: 'root',

      password: 'Planeación2026**',

      database: 'intranet_db',

      autoLoadEntities: true,

      synchronize: false,
    }),


    EventsModule,

    EmployeeModule,

    NewsModule,

    NotificationsModule,

    BirthdayImageModule,

    AuthModule,
  ],

})

export class AppModule {}