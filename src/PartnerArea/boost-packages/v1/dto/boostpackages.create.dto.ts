import {
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString
} from 'class-validator';



export class BoostPackagesClinicPackageCreateDTO {
  @IsUUID()
  clinicPackageId: string;

  @IsUUID()
  boostPackageId: string;

  @IsDateString()
  startAt: string; 

  @IsDateString()
  endAt: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsUUID()
  clinicuserid?: string;

}
