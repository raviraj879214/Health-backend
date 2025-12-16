import { PackageOneUpdateDto } from "../v1/dto/packagestepone.update.dto";



export interface IPackageStepOneService{

    getPackageList(clinicuuid:string);

    getPackageDetails(id:string);


    insertPackageStepOne(dto:PackageOneUpdateDto);



}