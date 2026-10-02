import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * DTO utilizado para cambiar la contraseña
 * del usuario autenticado.
 */
export class ChangePasswordDto {

  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}