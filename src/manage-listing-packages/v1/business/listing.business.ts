import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateListingDto } from "../dto/create.listing.dto";
import { UpdateListingDto } from "../dto/update.listing.dto";





@Injectable()
export class ListingBusiness{

     validId(id)
    {
        console.log("id",id);
        
        if(!id || id == 0)
        {
             throw new BadRequestException("Id is required");
        }
    }




    createValidate(dto : CreateListingDto){
        if(dto.name === "" || dto.name == null){
            throw new BadRequestException("Name is required");
        }

        if(dto.price == 0){
             throw new BadRequestException("Price is required");
        }

        if(dto.durationDays == 0){
            throw new BadRequestException("Duration must be  greater than one");
        }

         if(dto.priorityLevel == 0){
            throw new BadRequestException("priority must be  greater than one");
        }
    }


    updateValidate(dto:UpdateListingDto){
         if(dto.name == "" && dto.name == null){
            throw new BadRequestException("Name is required");
        }

        if(dto.price == 0){
             throw new BadRequestException("Price is required");
        }

        if(dto.durationDays == 0){
            throw new BadRequestException("Duration must be  greater than one");
        }
        
         if(dto.priorityLevel == 0){
            throw new BadRequestException("priority must be  greater than one");
        }
    }













    
}