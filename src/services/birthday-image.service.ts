import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Servicio encargado de gestionar la imagen de cumpleaños utilizada en la Intranet.
 *
 * Este servicio permite consultar y actualizar el nombre
 * del archivo de imagen almacenado en un archivo de configuración
 * JSON dentro del directorio de cargas.
 */
@Injectable()
export class BirthdayImageService {
  private configPath = path.join(process.cwd(), 'uploads', 'birthdays', 'config.json');

  /**
   * Obtiene el nombre de la imagen de cumpleaños actualmente registrada.
   *
   * Lee el archivo de configuración y retorna el nombre del archivo almacenado. Si el archivo no existe o ocurre algún
   * error durante la lectura, retorna null.
   *
   * @returns {Promise<string | null>}
   * Nombre de la imagen configurada o null si no existe.
   */
  async getImageName(): Promise<string | null> {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      const { filename } = JSON.parse(data);
      return filename || null;
    } catch {
      return null;
    }
  }

  /**
   * Guarda el nombre de la imagen de cumpleaños activa.
   *
   * Actualiza el archivo de configuración JSON con el nombre
   * del archivo recibido como parámetro.
   *
   * @param {string} filename Nombre del archivo de imagen que se establecerá como activo.
   *
   * @returns {Promise<string>} Nombre del archivo almacenado.
   */
  async saveImageName(filename: string) {
    await fs.writeFile(this.configPath, JSON.stringify({ filename }, null, 2));
    return filename;
  }
}
