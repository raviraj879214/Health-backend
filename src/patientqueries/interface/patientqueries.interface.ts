import { PatientQueryCreateDto } from "../v1/dto/patientqueries.create.dto";



export interface IPatientQueries{

    getPateintQueries(page: number, limit: number);


    getPatientQueryDetails(id:string);


    insertFinalDealPrice(dto:PatientQueryCreateDto);

}