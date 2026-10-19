import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from './create-news-dto';

/**
 * DTO utilizado para la actualización de noticias.
 * Todos los campos son opcionales, permitiendo realizar actualizaciones parciales.
 */
export class UpdateNewsDto
  extends PartialType(CreateNewsDto) {}