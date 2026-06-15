
import { Request } from "express";


export interface SeoOGImageRequest extends Request {
  files?: {
    ogImage?: Express.Multer.File[];
  };

   body: {
    id:string;
   };
}