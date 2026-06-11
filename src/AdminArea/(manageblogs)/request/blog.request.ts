import { Request } from "express";

export interface BlogRequest extends Request {
  files?: {
    image?: Express.Multer.File[];
    writerImage?: Express.Multer.File[];
    reviewerImage?: Express.Multer.File[];
    ogImage?: Express.Multer.File[];
  };

  body: {
    updateid : string;
    title?: string;
    content?: string;
    readingMinutes?: string;

    metaTitle?: string;
    metaKeywords?: string;
    metaDescription?: string;

    se_structure?: string;
    og_structure?: string;

    writerName?: string;
    reviewerName?: string;

    // OG DATA
    ogUrl?: string;
    ogType?: string;
    publisher?: string;
  };
}