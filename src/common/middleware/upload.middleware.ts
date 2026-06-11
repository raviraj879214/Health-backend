// src/common/middleware/upload.middleware.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { extname } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

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
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error("Only image files are allowed!"));
      }

      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "writerImage", maxCount: 1 },
    { name: "reviewerImage", maxCount: 1 },
     { name: "ogImage", maxCount: 1 }
  ]);

  return async (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          message: err.message || "File upload error",
        });
      }

      try {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (!files || Object.keys(files).length === 0) {
          return next();
        }

        for (const fieldName of Object.keys(files)) {
          const file = files[fieldName][0];

          const randomName = Array.from({ length: 32 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");

          const fileName =
            randomName + extname(file.originalname);

          const s3Key = uploadPath
            ? `${uploadPath.replace(/\\/g, "/")}/${fileName}`
            : fileName;

          const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype,
          });

          await s3.send(command);

          const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

          switch (fieldName) {
            case "image":
              (req as any).file = file;
              (req as any).fileName = fileName;
              (req as any).fileUrl = fileUrl;
              break;

            case "writerImage":
              (req as any).writerFile = file;
              (req as any).writerFileName = fileName;
              (req as any).writerFileUrl = fileUrl;
              break;

            case "reviewerImage":
              (req as any).reviewerFile = file;
              (req as any).reviewerFileName = fileName;
              (req as any).reviewerFileUrl = fileUrl;
              break;

            case "ogImage":
              (req as any).ogFile = file;
              (req as any).ogFileName = fileName;
              (req as any).ogFileUrl = fileUrl;
              break;
          }
        }

        next();
      } catch (uploadErr) {
        console.error("S3 upload error:", uploadErr);

        return res.status(500).json({
          message: "Error uploading file to S3",
        });
      }
    });
  };
}