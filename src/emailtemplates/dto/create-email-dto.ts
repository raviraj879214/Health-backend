import { IsInt, IsString } from "class-validator";



export class CreateEmailModule{


    @IsString()
    name : string;


    @IsString()
    subject: string

    @IsString()
    body :string
}