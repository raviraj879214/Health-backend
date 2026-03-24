import { BoostPackageCreateDto } from "../v1/dto/boostpackage.create.dto";
import { BoostPackageUpdateDto } from "../v1/dto/boostpackage.update.dto";





export interface IBoostPackage{

    getAll(page:number,limit:number,userid:number);
    

    createPackages(dto:BoostPackageCreateDto);

    updatePackages(dto:BoostPackageUpdateDto);


    updatepackageType(id:string,type:string);


}