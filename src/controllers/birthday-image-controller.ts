import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { BirthdayImageService } from '../services/birthdayImage-service';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';

import { RolesGuard } from '../guards/roles-guard';

import { Roles } from '../decorators/roles-decorator';


/**
 * Controlador encargado de gestionar la imagen de cumpleaños
 * utilizada en la Intranet.
 *
 * GET:
 * Permite consultar la imagen actual.
 *
 * POST:
 * Permite actualizar la imagen únicamente a usuarios
 * con rol ADMINISTRADOR.
 */
@Controller('birthday-image')
export class BirthdayImageController {

  constructor(
    private readonly service: BirthdayImageService,
  ) {}


  /**
   * Obtiene el nombre de la imagen de cumpleaños
   * actualmente configurada.
   *
   * Este endpoint puede ser consultado sin autenticación
   * para permitir que la Intranet muestre la imagen.
   */
  @Get()
  @HttpCode(200)
  async getImage() {

    const filename =
      await this.service.getImageName();

    return {
      image: filename,
    };
  }


  /**
   * Carga una nueva imagen de cumpleaños.
   *
   * Este endpoint solamente puede ser utilizado
   * por un usuario autenticado con rol ADMINISTRADOR.
   */
  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMINISTRADOR')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('image', {

      storage: diskStorage({

        destination:
          './uploads/birthdays',

        filename: (
          req,
          file,
          cb,
        ) => {

          const ext =
            extname(
              file.originalname,
            );

          cb(
            null,
            `birthday_${Date.now()}${ext}`,
          );
        },

      }),

    }),
  )
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {

    await this.service.saveImageName(
      file.filename,
    );

    return {
      message: 'Imagen actualizada',
      filename: file.filename,
    };
  }
}