import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from '../services/events-service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateEventDto } from '../DTOs/create-event-dto';
import { UpdateEventDto } from '../DTOs/update-event-dto';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles } from '../decorators/roles-decorator';

/**
 * Controlador encargado de gestionar los eventos de la Intranet.
 *
 * Consulta de eventos:
 * - Público para todos los usuarios.
 *
 * Gestión de eventos:
 * - ADMINISTRADOR
 * - COMUNICACIONES
 */
@Controller('events')
export class EventsController {

  constructor(
    private readonly eventsService: EventsService,
  ) {}

  /**
   * Obtiene la lista completa de eventos.
   *
   * Este endpoint es público.
   */
  @Get()
  @HttpCode(200)
  findAll() {
    return this.eventsService.findAll();
  }

  /**
   * Obtiene un evento específico.
   *
   * Este endpoint es público.
   */
  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id') id: number,
  ) {
    return this.eventsService.findOne(id);
  }

  /**
   * Crea un nuevo evento.
   *
   * Solo pueden realizar esta operación:
   * - ADMINISTRADOR
   * - COMUNICACIONES
   */
  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    'ADMINISTRADOR',
    'COMUNICACIONES',
  )
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/events',

        filename: (
          req,
          file,
          cb,
        ) => {

          const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(
              Math.random() * 1e9,
            );

          cb(
            null,
            uniqueSuffix +
              extname(
                file.originalname,
              ),
          );
        },
      }),
    }),
  )
  create(
    @Body() body: CreateEventDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {

    return this.eventsService.create({
      ...body,
      image: file
        ? file.filename
        : undefined,
    });
  }

  /**
   * Actualiza un evento existente.
   *
   * Solo pueden realizar esta operación:
   * - ADMINISTRADOR
   * - COMUNICACIONES
   */
  @Put(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    'ADMINISTRADOR',
    'COMUNICACIONES',
  )
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/events',

        filename: (
          req,
          file,
          cb,
        ) => {

          const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(
              Math.random() * 1e9,
            );

          cb(
            null,
            uniqueSuffix +
              extname(
                file.originalname,
              ),
          );
        },
      }),
    }),
  )
  update(
    @Param('id') id: number,
    @Body() body: UpdateEventDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {

    return this.eventsService.update(
      id,
      {
        ...body,
        image:
          file?.filename ||
          body.image,
      },
    );
  }

  /**
   * Elimina un evento.
   *
   * Solo pueden realizar esta operación:
   * - ADMINISTRADOR
   * - COMUNICACIONES
   */
  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    'ADMINISTRADOR',
    'COMUNICACIONES',
  )
  @HttpCode(200)
  async remove(
    @Param('id') id: number,
  ) {

    const event =
      await this.eventsService.findOne(id);

    if (!event) {
      throw new NotFoundException(
        'Evento no encontrado',
      );
    }

    await this.eventsService.remove(id);

    return {
      message:
        'Evento eliminado correctamente',
    };
  }
}