import { Module } from '@nestjs/common';
import { BirthdayImageController } from '../controllers/birthday-image.controller';
import { BirthdayImageService } from '../services/birthday-image.service';

@Module({
  controllers: [BirthdayImageController],
  providers: [BirthdayImageService],
})
export class BirthdayImageModule {}
