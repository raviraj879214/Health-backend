import { BadRequestException, Injectable } from "@nestjs/common";




@Injectable()
export class SpecialtyTypeBusiness {



validateName(name: string) {
    console.log("validating name...");
    if (!name || name.trim() === "") {
      throw new BadRequestException("Name is required");
    }
  }

  
  validateLength(name: string) {
    console.log("validating length...");
    if (name.length < 1) {
      throw new BadRequestException("Name must be at least 2 characters");
    }
  }


        validateSameName(name: string, exist: any) {
           
        if (exist) {
            throw new BadRequestException(`Name "${name}" already exists`);
        }
        }



}
