import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from '../DTOs/create-news.dto';

/**
 * DTO para la actualización de noticias.
 *
 * Extiende el DTO de creación de noticias y transforma todos sus atributos en opcionales, permitiendo actualizar de forma
 * parcial la información de una noticia existente.
 */
export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
