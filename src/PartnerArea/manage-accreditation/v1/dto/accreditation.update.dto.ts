

import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class AccreditationsCreateDto {

  @IsOptional()
  @IsString()
  clinicuuid?: string;

  @IsNotEmpty()
  @IsNumber()
  accreditationId: number;
}
