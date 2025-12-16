import { PackageSpecialityUpdateDto } from "../v1/dto/packagestepthree.update.dto";




export interface IPackageStepThree{




        getPackageSpecialitys(packageId:string);
        
        getSpecialitys();
    
        selectSpeciality(dto:PackageSpecialityUpdateDto);
    
        deleteSpecilaity(dto:PackageSpecialityUpdateDto);
    
        createOther(dto:PackageSpecialityUpdateDto);



}