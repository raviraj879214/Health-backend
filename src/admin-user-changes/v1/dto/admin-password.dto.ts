import { IsString } from "class-validator";




export class AdminPassword{

    @IsString()
    oldpassword : string;

    @IsString()
    newpassword : string;
}