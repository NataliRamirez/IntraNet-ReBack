import { IsBoolean, IsString, Length } from 'class-validator';

export class CreateTermsAcceptanceDto {
  @IsString()
  @Length(1, 30)
  termsVersion!: string;

  @IsBoolean()
  accepted!: boolean;
}