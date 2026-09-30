import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUrl } from 'class-validator';

/**
 * DTO para la creación de eventos.
 *
 * Define y valida la información necesaria para registrar un nuevo evento dentro del sistema.
 */
export class CreateEventDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  date_time!: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsString()
  image?: string;

}