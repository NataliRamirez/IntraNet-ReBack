import {
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

/**
 * DTO utilizado para la creación de empleados.
 *
 * Define y valida los datos requeridos para registrar
 * un nuevo empleado dentro del sistema de la Intranet.
 */
export class CreateEmployeeDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  id_card!: string;

  @IsString()
  @IsNotEmpty()
  job_position!: string;

  @IsString()
  @IsNotEmpty()
  area!: string;

  @IsDateString()
  birthday!: string;
}