import { IsString, IsOptional, IsNumber, Min, IsBoolean } from "class-validator";

export class CreateListingDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;  

  @IsNumber()
  @Min(1)
  durationDays: number;

  @IsOptional()
  @IsNumber()
  priorityLevel?: number; 

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
}
