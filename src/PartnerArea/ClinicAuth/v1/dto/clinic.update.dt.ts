import { IsOptional, IsString } from "class-validator";



export class updateClinicUser {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
