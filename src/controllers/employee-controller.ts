import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { EmployeeService } from '../services/employee-service';
import { CreateEmployeeDto } from '../DTOs/create-employee-dto';
import { UpdateEmployeeDto } from '../DTOs/update-employee-dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles } from '../decorators/roles-decorator';

const uploadDirectory = join(process.cwd(),'uploads','employees',);
if (!existsSync(uploadDirectory)) {
  mkdirSync(uploadDirectory, { recursive: true });
}

const imageInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}` + extname(file.originalname).toLowerCase();

      callback(null, uniqueName);
    },
  }),
});

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) { }

  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @UseInterceptors(imageInterceptor)
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) { if (file) {
      createEmployeeDto.image = file.filename;
    }

    return this.employeeService.create(createEmployeeDto,req.user,);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @UseInterceptors(imageInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {if (file) {
      updateEmployeeDto.image = file.filename;
    }

    return this.employeeService.update(Number(id),updateEmployeeDto,req.user,);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.employeeService.remove(Number(id),req.user,);
  }
}