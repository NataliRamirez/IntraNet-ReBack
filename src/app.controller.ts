import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controlador principal de la aplicación.
 *
 * Gestiona las solicitudes HTTP relacionadas con la ruta raíz del sistema y actúa como punto de entrada para validar que
 * la API se encuentra disponible y funcionando correctamente.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

   /**
   * Obtiene el mensaje principal de la aplicación.
   *
   * Endpoint utilizado para verificar que la API se encuentra disponible y respondiendo correctamente.
   *
   * Ruta: GET /
   *
   * @returns {string} Mensaje de bienvenida o estado de funcionamiento.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
