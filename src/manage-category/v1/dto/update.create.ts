import { IsInt, IsOptional, IsString } from "class-validator";





export class UpdateCategoryDto {


    @IsString()
    name: string;

    @IsOptional()
    @IsInt()
    id?: number;

    @IsOptional()
    @IsInt()
    parent_category_id?: number;

}