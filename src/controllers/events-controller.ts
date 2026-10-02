import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from '../services/events-service';

import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles-decorator';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  // ==========================================
  // PÚBLICO
  // ==========================================

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.eventsService.findOne(
      Number(id),
    );
  }

  // ==========================================
  // ADMINISTRADOR / COMUNICACIONES
  // ==========================================

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    'ADMINISTRADOR',
    'COMUNICACIONES',
  )
  async create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any,
  ) {
    /*
     * req.user identifica al usuario que
     * creó el evento.
     *
     * EventsService generará las notificaciones
     * para los administradores.
     */
    return this.eventsService.create(
      createEventDto,
      req.user,
    );
  }

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    'ADMINISTRADOR',
    'COMUNICACIONES',
  )
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: any,
  ) {
    /*
     * req.user identifica quién modificó
     * el evento.
     */
    return this.eventsService.update(
      Number(id),
      updateEventDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    'ADMINISTRADOR',
    'COMUNICACIONES',
  )
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    /*
     * Se pasa el usuario porque, aunque el
     * evento sea eliminado, necesitamos saber
     * quién realizó la eliminación para crear
     * la notificación.
     */
    return this.eventsService.remove(
      Number(id),
      req.user,
    );
  }
}