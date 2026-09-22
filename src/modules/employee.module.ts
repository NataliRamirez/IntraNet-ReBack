import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';

/**
 * Módulo encargado de la gestión de empleados.
 *
 * Este módulo agrupa todos los componentes necesarios para administrar la información de los empleados
 * registrados en la Intranet.
 *
 * Componentes:
 * - EmployeeController: Expone los endpoints de gestión de empleados.
 * - EmployeeService: Implementa la lógica de negocio.
 * - Employee: Entidad asociada a la persistencia de datos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
