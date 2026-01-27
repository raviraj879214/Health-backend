

import { IsOptional, IsString } from 'class-validator';

export class UpdateOtherInformationDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  value?: string;
}
