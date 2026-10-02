import { Module } from '@nestjs/common';

import { BirthdayImageController } from '../controllers/birthday-image-controller';
import { BirthdayImageService } from '../services/birthdayImage-service';

/**
 * Módulo encargado de la gestión de imágenes de cumpleaños.
 *
 * GET:
 * - Público para consultar la imagen actual.
 *
 * POST:
 * - Requiere autenticación.
 * - Solo permite al rol ADMINISTRADOR.
 */
@Module({
  controllers: [
    BirthdayImageController,
  ],

  providers: [
    BirthdayImageService,
  ],
})
export class BirthdayImageModule {}