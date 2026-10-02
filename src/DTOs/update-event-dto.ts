import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event-dto';

/**
 * DTO utilizado para la actualización de eventos.
 *
 * Todos los campos son opcionales, permitiendo realizar
 * actualizaciones parciales.
 */
export class UpdateEventDto
  extends PartialType(CreateEventDto) {}