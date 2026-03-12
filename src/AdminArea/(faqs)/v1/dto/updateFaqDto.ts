import { IsString } from "class-validator";



export class UpdateFaqDto{

    @IsString()
    id : string;

    @IsString()
    question : string;

    @IsString()
    answer : string;

    


}