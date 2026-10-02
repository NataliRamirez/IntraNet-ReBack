import {
  Controller,
  Get,
} from '@nestjs/common';

import { AppService } from './app.service';

/**
 * Controlador principal de la aplicación.
 *
 * Gestiona la ruta raíz de la API y permite comprobar
 * que el servidor se encuentra disponible.
 *
 * Esta ruta es pública y no requiere autenticación.
 */
@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
  ) {}

  /**
   * Verifica que la API se encuentra disponible.
   *
   * Endpoint:
   * GET /
   *
   * @returns Mensaje de estado de la aplicación.
   */
  @Get()
  getHello(): string {

    return this.appService.getHello();
  }
}