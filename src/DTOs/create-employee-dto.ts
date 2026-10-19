import {IsString, IsNotEmpty, IsDateString,} from 'class-validator';

/**
 * DTO utilizado para la creación de empleados.
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