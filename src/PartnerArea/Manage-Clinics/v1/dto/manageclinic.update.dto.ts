import { IsOptional } from "class-validator";



export class ManageClinicDto{

    clinicuuid : string;

    
    @IsOptional()
    name : string;


    @IsOptional()
    email : string;


     @IsOptional()
    address : string;


       @IsOptional()
     phone : string;

       @IsOptional()
     whatsappNumber : string;


       @IsOptional()
     telegramNumber : string;


     

      @IsOptional()
     websiteurl : string;



    



    










}