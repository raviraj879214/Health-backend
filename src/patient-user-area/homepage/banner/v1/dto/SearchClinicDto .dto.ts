
import { IsOptional, IsString, IsArray } from 'class-validator';

export class SearchClinicDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsArray()
  treatments?: string[];
}