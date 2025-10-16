import { Injectable, Logger } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path/posix';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  deleteImage(filename: string, folder: string = 'blogs') {
    if (!filename) return;

    const filePath = join(process.cwd(), 'uploads', folder, filename);

    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
      } catch (err) {
        this.logger.error(`Failed to delete file: ${filePath}`, err);
      }
    } else {
      this.logger.warn(`File not found: ${filePath}`);
    }
  }
}
