// src/common/middleware/upload.middleware.ts
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();


if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REGION || !process.env.AWS_BUCKET) {
  throw new Error('AWS credentials, region, or bucket are not set in environment variables!');
}


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export function UploadMiddleware(uploadPath: string) {

  const storage = multer.memoryStorage();

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).single('image');

  return async (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'File upload error' });
      }

      if (!req.file) {
        return next();
      }

      if (!req.file) {
        return next();
      }

      try {

        const randomName = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        const fileName = `${randomName}${extname(req.file.originalname)}`;


        const s3Key = uploadPath ? uploadPath.replace(/\\/g, '/') + '/' + fileName: fileName;
        
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: s3Key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        });

        await s3.send(command);

   
        (req as any).fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        (req as any).fileName = fileName;
        

        next();


      } catch (uploadErr) {
        console.error('S3 upload error:', uploadErr);
        return res.status(500).json({ message: 'Error uploading file to S3' });
      }
    });
  };
}