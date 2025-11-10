import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";




export class UpdateListingDto{

      @IsInt()
      id :number

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