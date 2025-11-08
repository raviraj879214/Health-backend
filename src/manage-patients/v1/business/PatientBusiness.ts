import { BadRequestException, Injectable } from "@nestjs/common";






@Injectable()
export class PatientBusiness{


    validId(id){
        if(!id || id == 0){
             throw new BadRequestException("Id is required");
        }
    }

    



}