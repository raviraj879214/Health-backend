// src/common/s3/s3.controller.ts
import { Controller, Get, Param, Res, NotFoundException, Query } from '@nestjs/common';
import type { Response } from 'express';
import { S3Service } from './s3.service';

@Controller('uploads')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get()
  async getFile(
    @Query('filepath') filepath: string,
    
    @Res() res: Response,
  ) {
    const key = `uploads/${filepath}`; // adjust path based on your S3 key
    console.log("key",key);


    try {
      const fileStream = await this.s3Service.getFileStream(key);
      fileStream.pipe(res);
    } catch (err) {
      console.error(err);
      throw new NotFoundException('File not found in S3');
    }
  }
}