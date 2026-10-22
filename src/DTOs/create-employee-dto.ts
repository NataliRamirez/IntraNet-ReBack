import { IsString, IsNotEmpty, IsDateString, IsOptional} from 'class-validator';

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

  @IsOptional()
  @IsString()
  image?: string;
}