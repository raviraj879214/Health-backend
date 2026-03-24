import { IsString } from "class-validator";




export class BoostPackageCreateDto{

    @IsString()
    name :string;

    @IsString()
    price : string;
    
    @IsString()
    duration : string;

    @IsString()
    description : string;


}