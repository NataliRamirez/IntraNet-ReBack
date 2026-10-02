import { Injectable } from '@nestjs/common';

import { promises as fs } from 'fs';

import * as path from 'path';

/**
 * Servicio encargado de gestionar la imagen de cumpleaños
 * utilizada en la Intranet.
 *
 * Permite consultar y actualizar el nombre de la imagen
 * almacenada en el directorio de cumpleaños.
 */
@Injectable()
export class BirthdayImageService {

  private configPath = path.join(
    process.cwd(),
    'uploads',
    'birthdays',
    'config.json',
  );

  /**
   * Obtiene el nombre de la imagen de cumpleaños actualmente registrada.
   *
   * @returns Nombre del archivo o null si no existe.
   */
  async getImageName(): Promise<string | null> {

    try {

      const data = await fs.readFile(
        this.configPath,
        'utf8',
      );

      const { filename } =
        JSON.parse(data);

      return filename || null;

    } catch {

      return null;
    }
  }

  /**
   * Guarda el nombre de la imagen de cumpleaños activa.
   *
   * @param filename Nombre del archivo.
   */
  async saveImageName(
    filename: string,
  ): Promise<string> {

    try {

      await fs.writeFile(
        this.configPath,
        JSON.stringify(
          { filename },
          null,
          2,
        ),
      );

      return filename;

    } catch (error) {

      throw error;
    }
  }
}