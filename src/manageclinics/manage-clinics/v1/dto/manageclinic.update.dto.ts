import { IsString } from "class-validator";






export class SendMessageCreateDto{
    
    @IsString()
    clinicId? : string;

    
    @IsString()
    messagetext:string;

    @IsString()
    type:string;
    



}