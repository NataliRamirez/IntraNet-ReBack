import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUrl } from 'class-validator';

export class CreateEventDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsDateString()
  dateTime: string; 
  @IsOptional() @IsString()
  lugar?: string;

  @IsOptional() @IsUrl()
  link?: string;

  @IsOptional() @IsString()
  imagen?: string; 
}
