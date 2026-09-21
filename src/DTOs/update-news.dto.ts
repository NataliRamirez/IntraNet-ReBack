import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsDto } from '../DTOs/create-news.dto';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}
