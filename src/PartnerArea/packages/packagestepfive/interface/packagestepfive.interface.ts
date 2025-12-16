import { PackageStepFiveUpdateDto } from "../v1/dto/packagestepfive.update.dto";



export interface IPackageStepFiveServices{

    

            getPackageProcedure(procedureid:string);
            
            getProcedure();
        
            selectProcedure(dto:PackageStepFiveUpdateDto);
        
            deleteProcedure(dto:PackageStepFiveUpdateDto);
        
            createOther(dto:PackageStepFiveUpdateDto);

}