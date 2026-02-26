import { RequestFundsCreateDto } from "../v1/dto/request.create.dto";




export interface IRequests{


    getPatientQueryRequest(clinicuuid:string,clinicuserid:string,page: number, limit: number);


    getPatientQueryDetails(patientqueryid:string);


    RequestFunds(dto:RequestFundsCreateDto);
    GEtRequestFunds(patientqueryid:string);



    getPalcesid(input:string);
    updateGooglePlacesID(dto:{placesid:string,uuid:string});

    getClinicDetails(uuid:string);
    getGooglePlaces(placesid:string);

    
    updatepatientQuery(queryid:string,status:string,reason:string);


}