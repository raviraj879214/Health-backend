import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";




export class UpdatedBlog{

    
    @IsString()
    id : string;

    @IsString()
    title : string;

    @IsString()
    content : string;

     @IsString()
     @IsOptional()
     image_url? : string;

     @IsString()
     tagid? : string





}