
import { Request } from 'express';



export interface DoctorRequest extends Request {


  file?: Express.Multer.File; 

  body : {
    doctoruuid? : string,
    clinicuuid? : string,
    firstname? : string
    lastname? :string,
    email? : string,
    dob? : string,
    crm? :string,
    languages?: string[];
    videourl? : string;
    cpf:string;
    degree:string;
  }

}