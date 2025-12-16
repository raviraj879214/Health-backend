import { ClinicSpecialityUpdateDto } from "../v1/dto/managespecialty.update.dto";




export interface IManageClinicSpecialty{
    
    
    getClinicSpecialitys(clinicuuid:string);
    
    getSpecialitys();

    selectSpeciality(dto:ClinicSpecialityUpdateDto);

    deleteSpecilaity(dto:ClinicSpecialityUpdateDto);

    createOther(dto:ClinicSpecialityUpdateDto);


}