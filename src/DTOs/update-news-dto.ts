import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from './create-news-dto';

/**
 * DTO utilizado para la actualización de noticias.
 *
 * Permite actualizar parcialmente una noticia,
 * enviando únicamente los campos que se desean modificar.
 */
export class UpdateNewsDto
  extends PartialType(CreateNewsDto) {}