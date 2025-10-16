// src/common/file/file.module.ts
import { Module } from '@nestjs/common';
import { FileService } from '../file.service';


@Module({
  providers: [FileService],
  exports: [FileService], // ✅ allows other modules to use FileService
})
export class FileModule {}
