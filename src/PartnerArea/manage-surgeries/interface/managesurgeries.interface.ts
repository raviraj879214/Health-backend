import { ManageSurgeriesCreateDto } from "../v1/dto/managesurgeries.create.dto";




export interface IManageSurgeries{

    getSurgeryImages(id:string);


    addSurgeriesImages(dto:ManageSurgeriesCreateDto);

    deleteSurgeriesImages(id:string);

    getTreatments(id:string);

    getDoctors(clinicuuid:string);

    getPackages(clinicuuid:string);
    
    
}