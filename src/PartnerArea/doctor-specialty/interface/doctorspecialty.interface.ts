import { DoctorSpecialtyUpdateDto } from "../v1/dto/doctorspecialty.update.dto";



export interface IDoctorSpecialty{

    getSpecialty();

    selectedSpecialty(doctoruuid:string);

    selectSpecialty(dto:DoctorSpecialtyUpdateDto);
    
    
    removeSpecialty(id:string);
    
    deleteSpecialty(dto:DoctorSpecialtyUpdateDto);


    createOther(dto:DoctorSpecialtyUpdateDto);

    
}