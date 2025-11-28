import { AccreditationsCreateDto } from "../v1/dto/accreditation.update.dto";



export interface IAccreditationService{
    
    getAllAccreditation();

    getSelectedAccreditation(clinicuuid: string);

    
    createSelectedAccreditations(dto:AccreditationsCreateDto);


    deleteAccreditation(id: number);
    
}