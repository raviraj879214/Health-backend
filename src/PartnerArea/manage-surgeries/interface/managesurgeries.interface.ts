import { ManageSurgeriesCreateDto } from "../v1/dto/managesurgeries.create.dto";




export interface IManageSurgeries{

    getSurgeryImages(id:string);


    addSurgeriesImages(dto:ManageSurgeriesCreateDto);

    deleteSurgeriesImages(id:string);

    getTreatments();

    getDoctors(clinicuuid:string);

    getPackages(clinicuuid:string);
    
    
}