
import { Request } from 'express';


export interface LicenseRequest extends Request {


  file?: Express.Multer.File; 

    body : {
        clinicuuid : string
    }

}