import { PackageTreatmentUpdateDto } from "../v1/dto/packagestepfour.update.dto";



export interface IPackageStepFourServices{


        getPackageTreatments(treatmentid:string);
        
        getTreatments();
    
        selectTreatment(dto:PackageTreatmentUpdateDto);
    
        deleteTreatments(dto:PackageTreatmentUpdateDto);
    
        createOther(dto:PackageTreatmentUpdateDto);


}