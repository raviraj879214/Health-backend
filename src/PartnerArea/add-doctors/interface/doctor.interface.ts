import { DoctorAddress, DoctorUpdateDto } from "../v1/dto/doctor.update.dto";




export interface IDoctorServices{

    getGlobalDoctorsList(clinicUuid:string);

    getClinicDoctorList(clinicuuid:string);

    getDoctors(clinicuuid:string);

    createUpdateDoctor(dto:DoctorUpdateDto);

    getDoctorDetails(doctoruuid:string);

    assignDoctorsClinic(dto:DoctorUpdateDto);

    getClinicAddress(clinicuuid:string);

    updateDoctorAddress(dto:DoctorAddress);

    getDoctorAddress(clinicuuid:string,doctoruuid:string);


    submitDoctor(clinicuuid:string,doctoruuid:string);

}