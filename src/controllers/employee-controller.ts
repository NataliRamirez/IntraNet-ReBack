import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { EmployeeService } from '../services/employee-service';

import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles-decorator';

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

  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.employeeService.findOne(
      Number(id),
    );
  }

  @Post()
  async create(
    @Body()
    createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(
      createEmployeeDto,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(
      Number(id),
      updateEmployeeDto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    return this.employeeService.remove(
      Number(id),
    );
  }
}