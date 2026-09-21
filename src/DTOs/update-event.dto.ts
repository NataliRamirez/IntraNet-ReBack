import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '../DTOs/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
