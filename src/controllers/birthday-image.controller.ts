import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BirthdayImageService } from '../services/birthday-image.service';

/**
 * Controlador encargado de gestionar la imagen de cumpleaños
 * utilizada en la Intranet.
 *
 * Permite consultar la imagen actual y cargar una nueva imagen
 * que será almacenada en el servidor.
 */
@Controller('birthday-image')
export class BirthdayImageController {
  constructor(private readonly service: BirthdayImageService) {}

   /**
   * Obtiene el nombre de la imagen de cumpleaños actualmente configurada.
   *
   * @returns Objeto con el nombre del archivo de imagen.
   */
  @Get()
  async getImage() {
    const filename = await this.service.getImageName();
    return { image: filename };
  }

  /**
   * Carga una nueva imagen de cumpleaños al sistema.
   *
   * La imagen es almacenada en el directorio
   * `./uploads/birthdays` y se le asigna un nombre único
   * basado en la fecha y hora actual para evitar conflictos.
   *
   * @param file Archivo de imagen recibido mediante multipart/form-data.
   * @returns Mensaje de confirmación y nombre del archivo almacenado.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/birthdays',
        /**
         * Genera un nombre único para la imagen subida.
         *
         * @param req Solicitud HTTP.
         * @param file Archivo recibido.
         * @param cb Callback utilizado por Multer para asignar el nombre final.
         */
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `birthday_${Date.now()}${ext}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.service.saveImageName(file.filename);
    return { message: 'Imagen actualizada', filename: file.filename };
  }
}
