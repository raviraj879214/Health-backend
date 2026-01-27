import { IsOptional, IsString } from "class-validator";







export class RequestFundsCreateDto{
    
    @IsString()
    patientqueryid : string;

    @IsString()
    amount :string;

    @IsOptional()
    @IsString()
    message :string;


}