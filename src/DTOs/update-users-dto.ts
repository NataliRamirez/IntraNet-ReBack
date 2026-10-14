import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUsersDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id_card?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  job_position?: string;

  @IsOptional()
  @IsInt()
  role_id?: number;
}