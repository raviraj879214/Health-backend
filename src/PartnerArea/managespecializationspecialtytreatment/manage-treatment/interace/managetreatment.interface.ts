import { ClinicTreatmentUpdateDto } from "../v1/dto/managetreatment.update.dto";


export interface IManageClinicTreatment{


        getClinicTreatments(clinicuuid:string);
        
        getTreatments();
    
        selectTreatment(dto:ClinicTreatmentUpdateDto);
    
        deleteTreatments(dto:ClinicTreatmentUpdateDto);
    
        createOther(dto:ClinicTreatmentUpdateDto);





}