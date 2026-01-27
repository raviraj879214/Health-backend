import { IsNotEmpty, IsString } from "class-validator";




export class PatientQueryCreateDto{

    @IsString()
    patientqueryid : string;

    @IsString()
    finalprice : string;

}




export class CreateOtherInformationDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
