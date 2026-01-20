import { PackageStepDoctorUpdateDto } from "../v1/dto/packagestepfive.update.dto";




export interface IPackageStepFiveServices{

    
    getSelectedDoctor(packageid:string);

           
    selectDoctor(dto:PackageStepDoctorUpdateDto);


    submitPackage(packageid:string);

    updateVisibilty(packageid:string,status:number);

     getDoctors(clinicuuid:string);



    

}