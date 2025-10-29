import { CreateCategoryDto } from "../v1/dto/create.category";
import { UpdateCategoryDto } from "../v1/dto/update.create";






export interface ICategoryService{


    getCategory(page: number, limit: number);


    createCategory(dto : CreateCategoryDto ,userId: number, ipAddress: string, userAgent: string);

    updateCategory(dto : UpdateCategoryDto ,userId: number, ipAddress: string, userAgent: string);

    
    deleteCategory(id: number, userId: number, ipAddress: string, userAgent: string);

    updateFeatured(id:number,featured : boolean);

}