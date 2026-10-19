import {Controller,Get,} from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controlador principal de la aplicación.
 *
 * Gestiona la ruta raíz de la API y permite comprobar que el servidor se encuentra disponible.
 */
@Controller()
export class AppController {

  constructor( private readonly appService: AppService,) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}