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

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname)); // 🔥 igual que en news
        },
      }),
    }),
  )
  create(@Body() body: CreateEventDto, @UploadedFile() file?: Express.Multer.File) {
    return this.eventsService.create({
      ...body,
      imagen: file ? file.filename : undefined,
    });
  }

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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException('Evento no encontrado');
    await this.eventsService.remove(id);
    return { message: 'Evento eliminado correctamente' };
  }
}
