import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../DTOs/create-employee.dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee.dto';

/**
 * Servicio encargado de la gestión de empleados.
 *
 * Proporciona la lógica de negocio necesaria para realizar operaciones CRUD sobre los empleados registrados en la
 * Intranet, incluyendo búsqueda, consulta, creación, actualización y eliminación.
 */
@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Obtiene todos los empleados registrados.
   *
   * @returns {Promise<Employee[]>} Lista completa de empleados.
   */
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

   /**
   * Busca empleados cuyo nombre coincida parcial o totalmente
   * con el criterio recibido.
   *
   * @param {string} name Nombre o fragmento del nombre a buscar.
   *
   * @returns {Promise<Employee[]>} Lista de empleados que coinciden con el criterio.
   */
  async findByName(name: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

   /**
   * Obtiene un empleado a partir de su identificador.
   *
   * @param {number} id Identificador único del empleado.
   *
   * @returns {Promise<Employee>} Información del empleado encontrado.
   *
   * @throws {NotFoundException} Si el empleado no existe.
   */
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    return employee;
  }

   /**
   * Crea un nuevo empleado.
   *
   * Convierte la fecha de cumpleaños recibida en formato de texto a un objeto Date antes de almacenarla.
   *
   * @param {CreateEmployeeDto} dto Datos necesarios para registrar un empleado.
   *
   * @returns {Promise<Employee>} Empleado creado exitosamente.
   */
  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const new = this.employeeRepository.create({
      ...dto,
      birthday: new Date(dto.birthday),
    });
    return await this.employeeRepository.save(new);
  }

   /**
   * Actualiza la información de un empleado existente.
   *
   * @param {number} id Identificador del empleado.
   *
   * @param {UpdateEmployeeDto} dto Datos a actualizar.
   *
   * @returns {Promise<Employee>} Empleado actualizado.
   *
   * @throws {NotFoundException} Si el empleado no existe.
   */
  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return await this.employeeRepository.save(employee);
  }

   /**
   * Elimina un empleado del sistema.
   *
   * @param {number} id Identificador del empleado a eliminar.
   *
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} Si el empleado no existe.
   */
  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }
}
