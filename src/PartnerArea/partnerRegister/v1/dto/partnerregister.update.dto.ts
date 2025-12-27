

import { IsString, IsNotEmpty, IsOptional, IsUrl, IsUUID, isString } from 'class-validator';





export class partnerRegisterCreateDto{
    isOtpVerify?:boolean;
    uuid?:String;
    firstname?:String;
    lastname?:string;
    password?:string;
    phonenno?:string;
}


export class PartnerRegisterClinicDetails {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()

  websiteurl?: string;

  @IsOptional()
  @IsUUID()
  uuid?: string;

  @IsString()
   @IsOptional()
  country:string;

    @IsString()
    @IsOptional()
    city:string;



  
}


