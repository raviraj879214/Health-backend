import { DoctorTreatmentDtoUpdate } from "../v1/dto/doctortreatment.update.dto";







export interface IDoctorTreatment{


    getTreatment();
    
        selectedTreatment(doctoruuid:string);
    
        selectTreatment(dto:DoctorTreatmentDtoUpdate);
        
        
        removeTreatment(id:string);
        
        deleteTreatment(dto:DoctorTreatmentDtoUpdate);
    
    
        createOther(dto:DoctorTreatmentDtoUpdate);

        
    
}