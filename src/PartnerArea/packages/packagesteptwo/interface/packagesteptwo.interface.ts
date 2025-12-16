import { PackageSpecializationUpdateDto } from "../v1/dto/packagesteptwo.update.dto";




export interface IManagePackageSpecialization{

    getPackageSpecializations(packageid:string);

    getSpecializations();

    selectSpecialization(dto:PackageSpecializationUpdateDto);

    deleteSpecilaization(dto:PackageSpecializationUpdateDto);

    createOther(dto:PackageSpecializationUpdateDto);

    
}

