import { SpecialtyCreateDto } from "../v1/dto/specialities.create";
import { SpecialtyUpdateDto } from "../v1/dto/specialities.update";



export interface ISpecialtyService{

    createSpecialty(data : SpecialtyCreateDto,userId: number, ipAddress: string, userAgent: string)


    getAllSpecialty(page: number, limit: number);


    updateSpecialty(dto: SpecialtyUpdateDto,userId: number, ipAddress: string, userAgent: string);

    
    deleteSpecialty(id : any,userId: number, ipAddress: string, userAgent: string);

}