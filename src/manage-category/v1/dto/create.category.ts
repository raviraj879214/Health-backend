import { IsBoolean, isInt, IsInt, IsOptional, IsString } from "class-validator";





export class CreateCategoryDto {

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsInt()
    parent_category_id?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsInt()
    sort_order?: number;

    @IsOptional()
    @IsBoolean()
    is_featured?: boolean;

    @IsOptional()
    @IsInt()
    level? : number;

}