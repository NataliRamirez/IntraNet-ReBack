import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../DTOs/create-employee.dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee.dto';

@Controller('empleados')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // 🔍 Obtener todos o filtrar por nombre
  @Get()
  findAll(@Query('name') name?: string) {
    if (name) {
      return this.employeeService.findByNombre(name);
    }
    return this.employeeService.findAll();
  }

  // 🔎 Obtener empleado por ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

  // ➕ Crear empleado
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  // ✏️ Actualizar empleado
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  // 🗑️ Eliminar empleado
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }
}
