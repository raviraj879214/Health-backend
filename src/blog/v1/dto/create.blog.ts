import { IsInt, IsOptional, IsString } from "class-validator";




export class CreatedBlog{

    
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
