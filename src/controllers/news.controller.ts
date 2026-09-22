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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NewsService } from '../services/news.service';
import { CreateNewsDto } from '../DTOs/create-news.dto';
import { UpdateNewsDto } from '../DTOs/update-news.dto';

/**
 * Controlador encargado de la gestión de noticias.
 *
 * Permite consultar, crear, actualizar y eliminar noticias, incluyendo la carga opcional de imágenes asociadas.
 *
 * Ruta base: /news
 */
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

   /**
   * Obtiene el listado completo de noticias registradas.
   *
   * @returns Lista de noticias.
   */
  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  /**
   * Obtiene una noticia específica mediante su id.
   *
   * @param id Identificador único de la noticia.
   * @returns Información de la noticia encontrada.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.newsService.findOne(id);
  }

   /**
   * Crea una nueva noticia.
   *
   * Permite adjuntar una imagen que será almacenada en ./uploads/news.
   *
   * @param body Datos de la noticia a registrar.
   * @param file Imagen asociada a la noticia.
   * @returns La noticia creada.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/news',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(@Body() body: CreateNewsDto, @UploadedFile() file?: Express.Multer.File) {
    return this.newsService.create({
      ...body,
      image: file ? file.filename : undefined,
    });
  }

  /**
   * Actualiza la información de una noticia existente.
   *
   * Si se adjunta una nueva imagen, esta reemplazará la anterior. En caso contrario, se conservará la imagen actual.
   *
   * @param id Identificador de la noticia a actualizar.
   * @param body Datos actualizados de la noticia.
   * @param file Nueva imagen de la noticia.
   * @returns La noticia actualizada.
   */
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/news',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: number,
    @Body() body: UpdateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.newsService.update(id, {
      ...body,
      image: file?.filename || body.image,
    });
  }

   /**
   * Elimina una noticia registrada.
   *
   * Verifica previamente que la noticia exista antes de proceder con la eliminación.
   *
   * @param id Identificador de la noticia a eliminar.
   * @returns Mensaje de confirmación de eliminación.
   * @throws NotFoundException Si la noticia no existe.
   */
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const news = await this.newsService.findOne(id);
    if (!news) throw new NotFoundException('Noticia no encontrada');
    await this.newsService.remove(id);
    return { message: 'Noticia eliminada correctamente' };
  }
}
