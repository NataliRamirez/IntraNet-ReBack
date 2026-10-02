import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { BirthdayImageService } from '../services/birthdayImage-service';

import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { RolesGuard } from '../guards/roles-guard';
import { Roles } from '../decorators/roles-decorator';

@Controller('birthday-image')
export class BirthdayImageController {
  constructor(
    private readonly birthdayImageService: BirthdayImageService,
  ) {}

  // ==========================================
  // PÚBLICO
  // ==========================================

  @Get()
  async getImage() {
    const filename =
      await this.birthdayImageService.getImageName();

    return {
      filename,
    };
  }

  // ==========================================
  // SOLO ADMINISTRADOR
  // ==========================================

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMINISTRADOR')
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.birthdayImageService.saveImageName(
      file.filename,
    );
  }
}