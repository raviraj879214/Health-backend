import { IsString } from "class-validator";




export class SendMessageCreateDto{
    
    @IsString()
    packageid? : string;

    
    @IsString()
    messagetext:string;

    @IsString()
    type:string;
    



}