import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class BirthdayImageService {
  private configPath = path.join(process.cwd(), 'uploads', 'birthdays', 'config.json');

  async getImageName(): Promise<string | null> {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      const { filename } = JSON.parse(data);
      return filename || null;
    } catch {
      return null;
    }
  }

  async saveImageName(filename: string) {
    await fs.writeFile(this.configPath, JSON.stringify({ filename }, null, 2));
    return filename;
  }
}
