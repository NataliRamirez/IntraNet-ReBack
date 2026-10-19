import {IsEmail, IsInt, IsString, MinLength, IsNotEmpty,} from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  id_card!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  job_position!: string;

  @IsInt()
  role_id!: number;
}