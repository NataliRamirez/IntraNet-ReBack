import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { NewsService } from '../services/news-service';
import { CreateNewsDto } from '../DTOs/create-news-dto';
import { UpdateNewsDto } from '../DTOs/update-news-dto';

import { Roles } from '../decorators/roles-decorator';
import { RolesGuard } from '../guards/roles-guard';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';

/**
 * Controlador encargado de la gestión de noticias.
 *
 * Consulta de noticias:
 * - Pública para todos los usuarios.
 *
 * Gestión de noticias:
 * - ADMINISTRADOR
 * - COMUNICACIONES
 *
 * Ruta base: /news
 */
@Controller('news')
export class NewsController {

  constructor(
    private readonly newsService: NewsService,
  ) {}

  /**
   * Obtiene el listado completo de noticias.
   *
   * Este endpoint es público.
   */
  @Get()
  @HttpCode(200)
  findAll() {
    return this.newsService.findAll();
  }

  /**
   * Obtiene una noticia específica mediante su id.
   *
   * Este endpoint es público.
   */
  @Get(':id')
  @HttpCode(200)
  findOne(
    @Param('id') id: number,
  ) {
    return this.newsService.findOne(id);
  }

  /**
   * Crea una nueva noticia.
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
        destination: './uploads/news',

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
    @Body() body: CreateNewsDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {

    return this.newsService.create({
      ...body,
      image: file
        ? file.filename
        : undefined,
    });
  }

  /**
   * Actualiza una noticia existente.
   *
   * Solo pueden realizar esta operación:
   * - ADMINISTRADOR
   * - COMUNICACIONES
   */
  @Patch(':id')
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
        destination: './uploads/news',

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
    @Body() body: UpdateNewsDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {

    return this.newsService.update(
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
   * Elimina una noticia.
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

    const news =
      await this.newsService.findOne(id);

    if (!news) {
      throw new NotFoundException(
        'Noticia no encontrada',
      );
    }

    await this.newsService.remove(id);

    return {
      message:
        'Noticia eliminada correctamente',
    };
  }
}