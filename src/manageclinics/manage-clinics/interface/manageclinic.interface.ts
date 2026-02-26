import { SendMessageCreateDto } from "../v1/dto/manageclinic.update.dto";





export interface IManageClinic{

    getClinicListing(page: number, limit: number,clinicuuid:string);
    getClinicDetails(clinicuuid:string);
    getClinicBannerImages(clinicuuid:string);
    getSurgeryImages(clinicuuid:string);
    getClinicDescription(clinicuuid:string);
    getAccreditations(clinicuuid:string);


    //clinic specialty
        getSpecialty(clinicuuid:string);
        getClinicSpecialty(clinicuuid:string);
        acceptSpecailty(id:string,clinicuuid:string);
        rejectSpecailty(id:string,clinicuuid:string);
        assignSpecialty(assignid:string,clinicuuid:string);
        unassignSpecialty(unassignid:string,clinicuuid:string);
    //end


    //clinic specialty
        getSubSpecialty(clinicuuid:string);
        getClinicSubSpecialty(clinicuuid:string);
        acceptSubSpecailty(id:string,clinicuuid:string);
        rejectSubSpecailty(id:string,clinicuuid:string);
        assignSubSpecialty(assignid:string,clinicuuid:string);
        unassignSubSpecialty(unassignid:string,clinicuuid:string);
    //end



    //clinic treatment
        getTreatment(clinicuuid:string);
        getClinicTreatment(clinicuuid:string);
        acceptTreatment(id:string,clinicuuid: string);
        rejectTreatment(id:string,clinicuuid: string);
        assignTreatment(assignid:string,clinicuuid:string);
        unassignTreatment(unassignid:string,clinicuuid:string);
    //end



    //clinic packages
     getClinicPackages(id:string);

    //packages end

    //manage-packages
     getPackages(page: number, limit: number);
     getpackagesDetails(id:string);   

    //end



    //make an action 
      sendMessageToClinic(dto:SendMessageCreateDto);
    
    //


    saveCommssion(id:string,commission:string);




    getCordinators();
    

    assignCordinators(clinicid:string,cordinatorid:string,userid:string);

    
    
}