import { IsString, IsDateString } from 'class-validator';

/**
 * DTO utilizado para la creación de empleados.
 *
 * Define y valida los datos requeridos para registrar un nuevo empleado dentro del sistema de la Intranet.
 */
export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  id_card: string;

  @IsString()
  job_position: string;

  @IsString()
  area: string;

  @IsDateString()
  birthday: string; // se envía como string ISO desde el front
}
