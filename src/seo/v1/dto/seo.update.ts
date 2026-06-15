import { IsInt, IsObject, IsOptional, IsString } from "class-validator";




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

  @IsOptional()
  @IsString()
  og_url?: string;

  @IsOptional()
  @IsString()
  og_type?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  og_image? : string;


  @IsOptional()
  @IsString()
  og_structure: any;



  
}