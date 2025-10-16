// src/common/middleware/upload.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { diskStorage } from 'multer';
import multer from 'multer'; // ✅ correct for v2+

import { extname } from 'path';

export function UploadMiddleware(uploadPath: string) {
  // Configure multer storage
  
  const storage = diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
      // Generate a random 32-character filename
      const randomName = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  });

  // Configure multer
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // Only allow image files
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }).single('image'); // Accept a single file named 'image'

  // Return middleware function
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'File upload error' });
      }
      next();
    });
  };
}
