import { IsString, IsDateString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  cedula: string;

  @IsString()
  cargo: string;

  @IsString()
  area: string;

  @IsDateString()
  fecha_nacimiento: string; // se envía como string ISO desde el front
}
