import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../entities/users-entity';
import { Roles } from '../entities/roles-entity';
import { UsersController } from '../controllers/users-controller';
import { UsersService } from '../services/users-service';
import { NotificationsModule } from './notifications-module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles]),NotificationsModule,],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}