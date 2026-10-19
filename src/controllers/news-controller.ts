import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors,} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';

import { NewsService } from '../services/news-service';

import { CreateNewsDto } from '../DTOs/create-news-dto';
import { UpdateNewsDto } from '../DTOs/update-news-dto';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles } from '../decorators/roles-decorator';

const uploadDirectory = join(process.cwd(), 'uploads', 'news');

mkdirSync(uploadDirectory, { recursive: true });

const newsImageInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: uploadDirectory,
    filename: (_req, file, callback) => {
      const uniqueName =
        `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
        extname(file.originalname).toLowerCase();

      callback(null, uniqueName);
    },
  }),
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new Error('Solo se permiten archivos de imagen.'),
        false,
      );
    }

    callback(null, true);
  },
});

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  // ==========================================
  // CONSULTAS PÚBLICAS
  // ==========================================

  @Get()
  async findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.newsService.findOne(Number(id));
  }

  // ==========================================
  // CREAR NOTICIA
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'COMUNICACIONES')
  @UseInterceptors(newsImageInterceptor)
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      createNewsDto.image = file.filename;
    }

    return this.newsService.create(
      createNewsDto,
      req.user,
    );
  }

  // ==========================================
  // ACTUALIZAR NOTICIA
  // ==========================================

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'COMUNICACIONES')
  @UseInterceptors(newsImageInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (file) {
      updateNewsDto.image = file.filename;
    }

    return this.newsService.update(
      Number(id),
      updateNewsDto,
      req.user,
    );
  }

  // ==========================================
  // ELIMINAR NOTICIA
  // ==========================================

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR', 'COMUNICACIONES')
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.newsService.remove(
      Number(id),
      req.user,
    );
  }
}