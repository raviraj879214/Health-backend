import { PackageStepDoctorUpdateDto } from "../v1/dto/packagestepfive.update.dto";




export interface IPackageStepFiveServices{

    
    getSelectedDoctor(packageid:string);

           
    selectDoctor(dto:PackageStepDoctorUpdateDto);

}