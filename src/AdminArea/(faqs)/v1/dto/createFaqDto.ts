import { IsString } from "class-validator";




export class CreateFaqDto{

    @IsString()
    id : string;

    @IsString()
    question : string;

    @IsString()
    answer : string;

    


}