



import strict from 'assert/strict';
import { IsOptional, IsString, IsNumber } from 'class-validator';


export class PackageOneUpdateDto {
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
    @IsString()
    actualPrice?: string;

    @IsOptional()
    @IsString()
    discountedPrice?: string;

    @IsOptional()
    @IsString()
    clinicId:string;


    @IsOptional()
    @IsString()
    homepagefeatures:string;



}
