import { RequestFundsCreateDto } from "../v1/dto/request.create.dto";




export interface IRequests{


    getPatientQueryRequest(clinicuuid:string,clinicuserid:string,page: number, limit: number);


    getPatientQueryDetails(patientqueryid:string);


    RequestFunds(dto:RequestFundsCreateDto);
    GEtRequestFunds(patientqueryid:string);

    
}