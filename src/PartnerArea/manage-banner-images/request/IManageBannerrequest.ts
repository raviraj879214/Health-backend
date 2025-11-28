




import { Request } from 'express';


export interface ManageBannerRequest extends Request {
  file?: Express.Multer.File; 

 
   body: {
    id : string,
    clinicuuid?: string;
    type?: string;
    sortbanner?: string;
    [key: string]: any;
  };
}
