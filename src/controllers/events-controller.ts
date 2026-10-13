
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

import { EventsService } from '../services/events-service';
import { CreateEventDto } from '../DTOs/create-event-dto';
import { UpdateEventDto } from '../DTOs/update-event-dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles } from '../decorators/roles-decorator';

const uploadDirectory = join(process.cwd(), 'uploads', 'events');

if (!existsSync(uploadDirectory)) {
  mkdirSync(uploadDirectory, { recursive: true });
}

const imageInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
      const uniqueName =
        `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
        extname(file.originalname).toLowerCase();

      callback(null, uniqueName);
    },
  }),
});

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  // Rutas públicas
  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(Number(id));
  }

  // Crear evento
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'COMUNICACIONES')
  @UseInterceptors(imageInterceptor)
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      createEventDto.image = file.filename;
    }

    return this.eventsService.create(
      createEventDto,
      req.user,
    );
  }

  // Actualizar evento
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'COMUNICACIONES')
  @UseInterceptors(imageInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      updateEventDto.image = file.filename;
    }

    return this.eventsService.update(
      Number(id),
      updateEventDto,
      req.user,
    );
  }

  // Eliminar evento
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'COMUNICACIONES')
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.eventsService.remove(
      Number(id),
      req.user,
    );
  }
}
