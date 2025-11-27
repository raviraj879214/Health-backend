import { ManageSurgeriesCreateDto } from "../v1/dto/managesurgeries.create.dto";




export interface IManageSurgeries{

    getSurgeryImages();

    addSurgeriesImages(dto:ManageSurgeriesCreateDto);

    deleteSurgeriesImages(id:string);
    
    
}