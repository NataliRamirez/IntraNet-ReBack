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
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateEventDto } from '../DTOs/create-event.dto';
import { UpdateEventDto } from '../DTOs/update-event.dto';

/**
 * Controlador encargado de gestionar las operaciones relacionadas con los eventos de la Intranet.
 *
 * Permite consultar, crear, actualizar y eliminar eventos, incluyendo la carga de imágenes asociadas.
 */
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Obtiene la lista completa de eventos registrados.
   *
   * @returns Lista de eventos.
   */
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

   /**
   * Obtiene la información de un evento específico mediante su identificador.
   *
   * @param id Identificador único del evento.
   * @returns Información del evento encontrado.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

   /**
   * Registra un nuevo evento en el sistema.
   *
   * Permite cargar una imagen asociada al evento, la cual será almacenada en el directorio
   * `./uploads/events`.
   *
   * @param body Información del evento a registrar.
   * @param file Archivo de imagen cargado opcionalmente.
   * @returns Evento creado.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/events',
        /**
         * Genera un nombre único para la imagen cargada por el usuario.
         *
         * @param req Solicitud HTTP.
         * @param file Archivo recibido.
         * @param cb Callback para asignar el nombre final.
         */
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname)); 
        },
      }),
    }),
  )
  create(@Body() body: CreateEventDto, @UploadedFile() file?: Express.Multer.File) {
    return this.eventsService.create({
      ...body,
      image: file ? file.filename : undefined,
    });
  }

   /**
   * Actualiza la información de un evento existente.
   *
   * Si se carga una nueva imagen, esta reemplazará la imagen actualmente asociada al evento.
   *
   * @param id Identificador único del evento.
   * @param body Datos actualizados del evento.
   * @param file Nueva imagen cargada opcionalmente.
   * @returns Evento actualizado.
   */
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: number,
    @Body() body: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventsService.update(id, {
      ...body,
      image: file?.filename || body.image,
    });
  }

   /**
   * Elimina un evento del sistema.
   *
   * Verifica previamente que el evento exista antes de realizar la eliminación.
   *
   * @param id Identificador único del evento.
   * @returns Mensaje de confirmación.
   * @throws NotFoundException Si el evento no existe.
   */
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException('Evento no encontrado');
    await this.eventsService.remove(id);
    return { message: 'Evento eliminado correctamente' };
  }
}
