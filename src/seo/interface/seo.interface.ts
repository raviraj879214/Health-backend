import { SeoUpdateDto } from "../v1/dto/seo.update";



export interface ISeoServices{


    getseopages();

    getseopagedetails(id : number);


    updateseopagedetails(dto : SeoUpdateDto ,userId: number, ipAddress: string, userAgent: string);
    
    
}