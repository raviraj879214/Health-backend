// ❌ Remove this line entirely
// import { File } from 'multer';

import { Request } from 'express';

export interface BlogRequest extends Request {
  file?: Express.Multer.File;  // ✅ Correct type

  body: {
    id?: string;
    title?: string;
    content?: string;
    [key: string]: any;
  };
  
}
