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

import { NewsService } from '../services/news-service';

import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles-decorator';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  // ==========================================
  // PÚBLICO
  // ==========================================

  @Get()
  async findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.newsService.findOne(
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
    @Body() createNewsDto: CreateNewsDto,
    @Req() req: any,
  ) {
    /*
     * req.user contiene:
     * {
     *   id,
     *   email,
     *   role
     * }
     *
     * Se envía al Service para que pueda
     * registrar quién creó la noticia y
     * generar las notificaciones.
     */
    return this.newsService.create(
      createNewsDto,
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
    @Body() updateNewsDto: UpdateNewsDto,
    @Req() req: any,
  ) {
    /*
     * El Service utilizará req.user para
     * identificar quién realizó la edición.
     */
    return this.newsService.update(
      Number(id),
      updateNewsDto,
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
     * El Service necesita req.user porque
     * la noticia será eliminada y después
     * debe generarse la notificación.
     */
    return this.newsService.remove(
      Number(id),
      req.user,
    );
  }
}