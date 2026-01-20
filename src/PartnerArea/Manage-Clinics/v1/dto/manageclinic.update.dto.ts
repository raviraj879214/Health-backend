import { IsOptional } from "class-validator";



export class ManageClinicDto {

  clinicuuid: string;

  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  address: string;


  @IsOptional()
  phone: string;

  @IsOptional()
  whatsappNumber: string;


  @IsOptional()
  telegramNumber: string;




  @IsOptional()
  websiteurl: string;



  @IsOptional()
  cep: string;


  @IsOptional()
  street: string;


  @IsOptional()
  complement: string;

  @IsOptional()
  neighborhood: string;

  @IsOptional()
  citycep: string;


  @IsOptional()
  state: string;



}



export class ClinicGoogleMap{
    uuid: string;

     @IsOptional()
    latitude: string;

    @IsOptional()
    longitude: string;

}