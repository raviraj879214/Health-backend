import { DoctorDescriptionUpdateDto } from "../v1/dto/doctordescription.update.dto";



export  interface IDoctorDescriptionService{


    getDescription(doctoruuid:string);


    updatedescription(dto:DoctorDescriptionUpdateDto);

    


}