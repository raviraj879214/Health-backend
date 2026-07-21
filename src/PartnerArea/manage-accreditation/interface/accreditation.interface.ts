import { AccreditationsCreateDto } from "../v1/dto/accreditation.update.dto";



export interface IAccreditationService{
    
    getAllAccreditation();

    getSelectedAccreditation(clinicuuid: string);

    
    createSelectedAccreditations(dto:AccreditationsCreateDto);


    deleteAccreditation(id: number);



    createLicense(image:string,id:string);

    getLicense(id:string);
    deleteLicense(id:string);
    
}