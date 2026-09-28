import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO utilizado para la creación de notificaciones.
 *
 * Contiene la información necesaria para registrar una notificación relacionada con una noticia o un evento dentro del sistema.
 */
export class CreateNewsDto {

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  shortDesc?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsDateString()
  publicationDate!: string;

}
