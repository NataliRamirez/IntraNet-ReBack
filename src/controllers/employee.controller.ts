import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../DTOs/create-employee.dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee.dto';

/**
 * Controlador encargado de gestionar las operaciones relacionadas con los empleados de la organización.
 *
 * Permite crear, consultar, actualizar, eliminar y filtrar empleados por nombre.
 */
@Controller('empleados')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

   /**
   * Obtiene la lista de empleados registrados.
   *
   * Si se proporciona el parámetro de consulta `name`, retorna únicamente los empleados cuyo nombre coincida
   * con el criterio de búsqueda.
   *
   * @param name Nombre utilizado para filtrar empleados.
   * @returns Lista completa o filtrada de empleados.
   */
  @Get()
  findAll(@Query('name') name?: string) {
    if (name) {
      return this.employeeService.findByName(name);
    }
    return this.employeeService.findAll();
  }

   /**
   * Obtiene la información de un empleado específico mediante su identificador.
   *
   * @param id Identificador único del empleado.
   * @returns Información del empleado encontrado.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

   /**
   * Registra un nuevo empleado en el sistema.
   *
   * @param dto Datos necesarios para la creación del empleado.
   * @returns Empleado creado.
   */
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

   /**
   * Actualiza la información de un empleado existente.
   *
   * @param id Identificador único del empleado.
   * @param dto Datos actualizados del empleado.
   * @returns Empleado actualizado.
   */
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

   /**
   * Elimina un empleado del sistema.
   *
   * @param id Identificador único del empleado.
   * @returns Confirmación de la eliminación.
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }
}
