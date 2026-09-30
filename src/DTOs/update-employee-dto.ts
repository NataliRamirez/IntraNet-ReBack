import { IsOptional, IsString, IsDateString } from 'class-validator';

/**
 * DTO utilizado para la actualización de empleados.
 *
 * Permite modificar de forma parcial la información de un empleado registrado en el sistema.
 *
 * Todos los campos son opcionales, por lo que solo se actualizarán aquellos que sean enviados en la solicitud.
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
