import { BadRequestException, Injectable } from "@nestjs/common";



@Injectable()
export class clinicAuthBusiness{


    validID(id : string){

        
        if(id == ""){
            throw new BadRequestException("id is required");
        }


    }

    



}