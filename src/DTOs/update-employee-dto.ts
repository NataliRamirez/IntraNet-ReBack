import {IsOptional,IsString,IsDateString,} from 'class-validator';

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

  @IsOptional()
  @IsString()
  image?: string;
}