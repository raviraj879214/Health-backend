import { PatientQueryCreateDto } from "../v1/dto/patientqueries.create.dto";
import { UpdateOtherInformationDto } from "../v1/dto/patientqueries.update.dto";



export interface IPatientQueries{

    getPateintQueries(page: number, limit: number, adminid:number);
    getPatientQueryDetails(id:string);
    insertFinalDealPrice(dto:PatientQueryCreateDto);
    getClinicList();
    assignClinicToPatientQuery(clinicid:string,queryid:string);
    getPackagesList(clinicid:string);
    assignPackageToQuery(packageid:string,queryid:string);
    getDoctorList(clinicid:string);
    assignDoctorToQuery(doctorid:string,queryid:string);
    assignQueryToClinic(patientqueryid:string,status:string);

    getAllCordinator();

    assignAdminCordinator(cordinatorid:string,patientqueryid:string,userid:string);









}