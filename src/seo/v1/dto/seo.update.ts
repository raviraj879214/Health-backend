import { IsInt, IsOptional, IsString } from "class-validator";




export class SeoUpdateDto{


 @IsInt()
  id: number;


  
  @IsString()
  title: string;

  @IsString()
  slug: string;


  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_desc?: string;

  @IsOptional()
  @IsString()
  meta_keywords?: string;




  
}