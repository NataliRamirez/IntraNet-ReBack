import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

/**
 * DTO utilizado para eliminar el perfil
 * del usuario autenticado.
 *
 * Requiere la contraseña actual del usuario
 * como confirmación antes de eliminar la cuenta.
 */
export class DeleteProfileDto {

  @IsString()
  @IsNotEmpty()
  password!: string;
}