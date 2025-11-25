import { IsOptional } from "class-validator";



export class ManageClinicDto{

    clinicuuid : string;

    
    @IsOptional()
    name : string;




}