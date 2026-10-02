import {
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

/**
 * DTO utilizado para la actualización de empleados.
 *
 * Permite modificar parcialmente la información
 * de un empleado registrado.
 */
export class UpdateEmployeeDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  id_card?: string;

  @IsOptional()
  @IsString()
  job_position?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;
}