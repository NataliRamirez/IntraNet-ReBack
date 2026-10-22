import { Injectable, NotFoundException, ConflictException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Employee } from '../entities/employee-entity';
import { CreateEmployeeDto } from '../DTOs/create-employee-dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee-dto';
import { NotificationsService } from './notifications-service';
import { NotificationAction } from '../enums/notification-action.enum';
import { NotificationEntity } from '../enums/notification-entity.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly notificationsService: NotificationsService,
  ) { }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Employee[]> {
    return this.employeeRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(
        `Empleado con ID ${id} no encontrado`,
      );
    }

    return employee;
  }

  // =====================================================
  // CONVERTIR FECHA SIN CAMBIAR EL DÍA
  // =====================================================

  private normalizeBirthday(birthday: string | Date): string {
    if (typeof birthday === 'string') {
      // Si viene como YYYY-MM-DD, conservar exactamente ese día.
      const match = birthday.match(/^(\d{4})-(\d{2})-(\d{2})/);

      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
    }

    const date = new Date(birthday);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  async create(
    dto: CreateEmployeeDto,
    actorUser: any,
  ): Promise<Employee> {
    try {
      const employeeData: any = { ...dto };

      if (dto.birthday) {
        employeeData.birthday = this.normalizeBirthday(dto.birthday);
      }

      const newEmployee = this.employeeRepository.create();
      Object.assign(newEmployee, employeeData);

      const savedEmployee = await this.employeeRepository.save(newEmployee,);

      await this.notificationsService.create(
        actorUser.id,
        NotificationEntity.EMPLOYEE,
        NotificationAction.CREATED,
        savedEmployee.id,
        savedEmployee.name,
        '/admin/employees',
      );

      return savedEmployee;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El número de documento ya está registrado.',);
      }

      throw error;
    }
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
    actorUser: any,
  ): Promise<Employee> {
    try {
      const employee = await this.findOne(id);
      const employeeData: any = { ...dto };

      if (dto.birthday) {
        employeeData.birthday = this.normalizeBirthday(dto.birthday);
      }

      Object.assign(employee, employeeData);

      const updatedEmployee = await this.employeeRepository.save(employee,);

      await this.notificationsService.create(
        actorUser.id,
        NotificationEntity.EMPLOYEE,
        NotificationAction.UPDATED,
        updatedEmployee.id,
        updatedEmployee.name,
        '/admin/employees',
      );

      return updatedEmployee;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El número de documento ya está registrado.',);
      }

      throw error;
    }
  }

  async remove(
    id: number,
    actorUser: any,
  ): Promise<{ message: string }> {
    const employee = await this.findOne(id);

    // Guardar los datos
    const employeeId = employee.id;
    const employeeName = employee.name;

    await this.employeeRepository.remove(employee);

    await this.notificationsService.create(
      actorUser.id,
      NotificationEntity.EMPLOYEE,
      NotificationAction.DELETED,
      employeeId,
      employeeName,
      '/admin/employees',
    );

    return {
      message: 'Empleado eliminado correctamente.',
    };
  }

  async findBirthdaysToday(): Promise<
    Pick<
      Employee,
      'id' | 'name' | 'job_position' | 'area' | 'birthday' | 'image'
    >[]
  > {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .select([
        'employee.id',
        'employee.name',
        'employee.job_position',
        'employee.area',
        'employee.birthday',
        'employee.image',
      ])
      .where('MONTH(employee.birthday) = MONTH(CURDATE())')
      .andWhere('DAY(employee.birthday) = DAY(CURDATE())')
      .orderBy('employee.name', 'ASC')
      .getMany();
  }
}
