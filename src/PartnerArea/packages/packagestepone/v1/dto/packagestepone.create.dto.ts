

import { IsOptional, IsString, IsNumber } from 'class-validator';



export class PackageOneCreateDto {
    
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    briefDescription?: string;

    @IsOptional()
    @IsNumber()
    actualPrice?: number;

    @IsOptional()
    @IsNumber()
    discountedPrice?: number;
}

