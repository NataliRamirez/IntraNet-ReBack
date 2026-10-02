import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * DTO utilizado para la creación de noticias.
 *
 * Define y valida la información necesaria para
 * registrar una nueva noticia.
 */
export class CreateNewsDto {

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  short_desc?: string;

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
  publication_date!: string;
}