import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO utilizado para la creación de notificaciones.
 *
 * Contiene la información necesaria para registrar una notificación relacionada con una noticia o un evento dentro del sistema.
 */
export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDesc: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  publicationDate: Date;
}
