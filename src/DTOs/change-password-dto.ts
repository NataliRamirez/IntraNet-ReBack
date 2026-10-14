import {
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString({
    message: 'La contraseña actual es obligatoria',
  })
  @MinLength(1, {
    message: 'La contraseña actual es obligatoria',
  })
  @MaxLength(72, {
    message: 'La contraseña actual es demasiado larga',
  })
  currentPassword!: string;

  @IsString({
    message: 'La nueva contraseña debe ser texto',
  })
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(72, {
    message: 'La nueva contraseña no puede superar 72 caracteres',
  })
  @NotEquals('', {
    message: 'La nueva contraseña es obligatoria',
  })
  newPassword!: string;
}
