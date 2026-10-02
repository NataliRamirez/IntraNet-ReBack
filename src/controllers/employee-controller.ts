import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { EmployeeService } from '../services/employee-service';
import { CreateEmployeeDto } from '../DTOs/create-employee-dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee-dto';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles } from '../decorators/roles-decorator';

/**
 * Controlador encargado de gestionar las operaciones relacionadas
 * con los empleados de la organización.
 *
 * Todas las operaciones requieren autenticación y el rol
 * ADMINISTRADOR.
 */
@Controller('employee')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles('ADMINISTRADOR')
export class EmployeeController {

  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  /**
   * Obtiene la lista de empleados registrados.
   *
   * Si se proporciona el parámetro de consulta `name`, retorna
   * únicamente los empleados cuyo nombre coincida con el criterio.
   *
   * @param name Nombre utilizado para filtrar empleados.
   * @returns Lista completa o filtrada de empleados.
   */
  @Get()
  @HttpCode(200)
  findAll(
    @Query('name') name?: string,
  ) {

    if (name) {
      return this.employeeService.findByName(name);
    }

    return this.employeeService.findAll();
  }

  /**
   * Obtiene la información de un empleado específico.
   *
   * @param id Identificador único del empleado.
   * @returns Información del empleado encontrado.
   */
  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id') id: number,
  ) {

    return this.employeeService.findOne(id);
  }

  /**
   * Registra un nuevo empleado.
   *
   * @param dto Datos necesarios para la creación.
   * @returns Empleado creado.
   */
  @Post()
  @HttpCode(201)
  create(
    @Body() dto: CreateEmployeeDto,
  ) {

    return this.employeeService.create(dto);
  }

  /**
   * Actualiza la información de un empleado.
   *
   * @param id Identificador único del empleado.
   * @param dto Datos actualizados.
   * @returns Empleado actualizado.
   */
  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {

    return this.employeeService.update(
      id,
      dto,
    );
  }

  /**
   * Elimina un empleado.
   *
   * @param id Identificador único del empleado.
   * @returns Confirmación de la eliminación.
   */
  @Delete(':id')
  @HttpCode(200)
  remove(
    @Param('id') id: number,
  ) {

    return this.employeeService.remove(id);
  }
}