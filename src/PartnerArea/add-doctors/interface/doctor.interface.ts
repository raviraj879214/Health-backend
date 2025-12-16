import { DoctorUpdateDto } from "../v1/dto/doctor.update.dto";




export interface IDoctorServices{

    getGlobalDoctorsList(clinicUuid:string);



    getClinicDoctorList(clinicuuid:string);



    getDoctors(clinicuuid:string);

    createUpdateDoctor(dto:DoctorUpdateDto);


    getDoctorDetails(doctoruuid:string);



    assignDoctorsClinic(dto:DoctorUpdateDto);

    

}