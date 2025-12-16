import { DoctorSpecializationUpdateDto } from "../v1/dto/doctorspecialization.update.dto";



export interface IDoctorSpecializationService{


    getSpecilization();

    selectSpecialization(dto:DoctorSpecializationUpdateDto);

    selectedSpecialization(doctoruuid:string);

    removeSpecialization(id:string);

    deleteSpecilaization(dto:DoctorSpecializationUpdateDto);

    createOther(dto:DoctorSpecializationUpdateDto);


}