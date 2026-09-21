import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../DTOs/create-employee.dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // 📋 Obtener todos los empleados
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  // 🔍 Buscar empleados por nombre
  async findByName(name: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  // 🔎 Obtener empleado por ID
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    return employee;
  }

  // ➕ Crear empleado
  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const new = this.employeeRepository.create({
      ...dto,
      birthday: new Date(dto.birthday),
    });
    return await this.employeeRepository.save(new);
  }

  // ✏️ Actualizar empleado
  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return await this.employeeRepository.save(employee);
  }

  // 🗑️ Eliminar empleado
  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
