

import { Request } from 'express';


export interface SurgeriesRequest extends Request {

  file?: Express.Multer.File; 

  body: {
    surgeryid?: string;
    type?: string;
    content?: string;
    [key: string]: any;
  };
}



