import { PatientUpdateDto } from "../v1/dto/patients.update.dto";




export interface IPatientServices{

    getPatientlist(page: number, limit: number,status:string);
    
    getPatientDetails(uuid:string);


    updateBlockStatus(dto: PatientUpdateDto);

    updateUnBlockStatus(id : number);


}