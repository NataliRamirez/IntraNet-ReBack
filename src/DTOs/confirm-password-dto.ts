import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

/**
 * DTO utilizado para confirmar la contraseña
 * del usuario autenticado.
 */
export class ConfirmPasswordDto {

  @IsString()
  @IsNotEmpty()
  password!: string;
}