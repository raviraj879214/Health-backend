import { IsString } from "class-validator";




export class PatientQueryCreateDto{

    @IsString()
    patientqueryid : string;

    @IsString()
    finalprice : string;

}