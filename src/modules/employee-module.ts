import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../entities/employee-entity';
import { EmployeeService } from '../services/employee-service';
import { EmployeeController } from '../controllers/employee-controller';
import { PublicEmployeeController } from '../controllers/public-employee-controller';
import { NotificationsModule } from './notifications-module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), NotificationsModule,],
  providers: [EmployeeService,],
  controllers: [EmployeeController,PublicEmployeeController,],
  exports: [EmployeeService,],
})
export class EmployeeModule {}
