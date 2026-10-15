
import { Controller, Get } from '@nestjs/common';
import { EmployeeService } from '../services/employee-service';

@Controller('public/employees')
export class PublicEmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  @Get('birthdays/today')
  async findBirthdaysToday() {
    return this.employeeService.findBirthdaysToday();
  }
}
