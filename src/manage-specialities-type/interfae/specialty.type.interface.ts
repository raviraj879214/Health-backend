import { SpecialtyCreateDto } from "../v1/dto/specialty-create.dto";
import { SpecialtyUpdateDto } from "../v1/dto/specialty-update.dto";




export interface ISpecialtyTypeService{

    getSpecialtyType(page: number, limit: number);


    createSpecilatyName(dto : SpecialtyCreateDto)

    updateSpecialtyName(dto : SpecialtyUpdateDto);

    deleteSpecialtyName(id : number);
    

}