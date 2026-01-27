

import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsUUID, isString, IsDate } from 'class-validator';





export class partnerRegisterCreateDto{
    isOtpVerify?:boolean;
    uuid?:String;
    firstname?:String;
    lastname?:string;
    password?:string;
    phonenno?:string;
    email?:string;
}


export class PartnerRegisterClinicDetails {

  @IsString()
   @IsOptional()
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


    @IsString()
    @IsOptional()
    clinicemail:string;

    @IsString()
    @IsOptional()
    latitude:Decimal;

    @IsString()
    @IsOptional()
    longitude:Decimal;


    @IsString()
    @IsOptional()
    cnpj:string;

    
    @IsString()
    @IsOptional()
    clinicid:string;


    @IsString()
    @IsOptional()
    phone:string;



    @IsString()
    @IsOptional()
    street: string;

    @IsString()
    @IsOptional()
    complement: string;

    @IsString()
    @IsOptional()
    neighborhood: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    cep: string;


    @IsString()
    @IsOptional()
    phoneVerify: number;


    @IsOptional()
    @IsDate()
    @Type(() => Date)
    CheckedTime?: Date;


    @IsString()
    @IsOptional()
    TermsID: string;


    
    @IsString()
    @IsOptional()
    addressnumber: string;

    @IsString()
    @IsOptional()
    unidade: string;

    @IsString()
    @IsOptional()
    estado: string;

    @IsString()
    @IsOptional()
    regiao: string;

    @IsString()
    @IsOptional()
    ibge: string;

    @IsString()
    @IsOptional()
    gia: string;

    @IsString()
    @IsOptional()
    ddd: string;

    @IsString()
    @IsOptional()
    siafi: string;












  
}


