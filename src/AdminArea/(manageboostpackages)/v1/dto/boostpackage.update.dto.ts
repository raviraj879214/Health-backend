import { IsString } from "class-validator";




export class BoostPackageUpdateDto{

    @IsString()
    name :string;

    @IsString()
    price : string;
    
    @IsString()
    duration : string;

    @IsString()
    description : string;

    @IsString()
    id:string;


}