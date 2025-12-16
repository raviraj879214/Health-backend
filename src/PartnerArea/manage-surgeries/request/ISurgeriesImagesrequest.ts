

import { Request } from 'express';


export interface SurgeriesRequest extends Request {

  file?: Express.Multer.File; 

  body: {
    surgeryid?: string;
    type?: string;
    content?: string;
    doctorUuid?:string;
    clinicUuid?:string;
    treatmentid?:string;
    [key: string]: any;
  };
}



