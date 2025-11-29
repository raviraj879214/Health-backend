import { ClinicDescritptionUpdateDto } from "../v1/dto/clinicdescription.update.dto";



export interface IClinicDescription{

    getClinicDescription(clinicuuid : string);

    
    createupdateClinicDescription(dto:ClinicDescritptionUpdateDto);

    



}