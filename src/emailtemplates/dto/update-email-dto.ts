import { IsInt, IsString } from "class-validator";



export class UpdateEmailModule{

    @IsInt()
    id : number ;

    @IsString()
    name : string;


    @IsString()
    subject: string

    @IsString()
    body :string
}