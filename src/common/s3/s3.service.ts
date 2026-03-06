// src/common/s3/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
  });

  async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });

    const response = await this.s3.send(command);

    // S3 returns a stream in Body
    return response.Body as Readable;
  }
}