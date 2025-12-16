import { ClinicSpecializationUpdateDto } from "../v1/dto/managespecialization.update.dto";



export interface IManageClinicSpecialization{

    getClinicSpecializations(clinicuuid:string);

    getSpecializations();

    selectSpecialization(dto:ClinicSpecializationUpdateDto);

    deleteSpecilaization(dto:ClinicSpecializationUpdateDto);

    createOther(dto:ClinicSpecializationUpdateDto);


}