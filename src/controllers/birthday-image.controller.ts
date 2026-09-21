import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BirthdayImageService } from '../services/birthday-image.service';

@Controller('birthday-image')
export class BirthdayImageController {
  constructor(private readonly service: BirthdayImageService) {}

  @Get()
  async getImage() {
    const filename = await this.service.getImageName();
    return { image: filename };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/birthdays',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `birthday_${Date.now()}${ext}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.service.saveImageName(file.filename);
    return { message: 'Imagen actualizada', filename: file.filename };
  }
}
