import { ManageClinicDto } from "../v1/dto/manageclinic.update.dto";




export interface IManageClinicService{


    get(id: String);

    getClinicDetails(id:String);

    updateClinicName(dto : ManageClinicDto);
    
    
}