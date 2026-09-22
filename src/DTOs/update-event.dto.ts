import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '../DTOs/create-event.dto';

/**
 * DTO utilizado para la actualización de eventos.
 *
 * Hereda todos los atributos definidos en {@link CreateEventDto}, convirtiéndolos en opcionales mediante la utilidad
 * {@link PartialType}.
 *
 * Permite realizar actualizaciones parciales de un evento, enviando únicamente los campos que se desean modificar.
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {}
