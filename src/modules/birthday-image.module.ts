import { Module } from '@nestjs/common';
import { BirthdayImageController } from '../controllers/birthday-image.controller';
import { BirthdayImageService } from '../services/birthday-image.service';

/**
 * Módulo encargado de la gestión de imágenes de cumpleaños.
 *
 * Este módulo agrupa los componentes necesarios para consultar y actualizar la imagen de cumpleaños que
 * será visualizada en la Intranet.
 *
 * Componentes:
 * - BirthdayImageController: Expone los endpoints para la gestión de imágenes.
 * - BirthdayImageService: Implementa la lógica de negocio asociada.
 */
@Module({
  controllers: [BirthdayImageController],
  providers: [BirthdayImageService],
})
export class BirthdayImageModule {}
