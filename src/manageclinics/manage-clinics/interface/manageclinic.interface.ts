




export interface IManageClinic{

    getClinicListing(page: number, limit: number);
    getClinicDetails(clinicuuid:string);
    getClinicBannerImages(clinicuuid:string);
    getSurgeryImages(clinicuuid:string);
    getClinicDescription(clinicuuid:string);


    //clinic specialty
        getSpecialty(clinicuuid:string);
        getClinicSpecialty(clinicuuid:string);
        acceptSpecailty(id:string);
        rejectSpecailty(id:string);
        assignSpecialty(assignid:string,clinicuuid:string);
        unassignSpecialty(unassignid:string,clinicuuid:string);
    //end


    //clinic specialty
        getSubSpecialty(clinicuuid:string);
        getClinicSubSpecialty(clinicuuid:string);
        acceptSubSpecailty(id:string);
        rejectSubSpecailty(id:string);
        assignSubSpecialty(assignid:string,clinicuuid:string);
        unassignSubSpecialty(unassignid:string,clinicuuid:string);
    //end



    //clinic treatment
        getTreatment(clinicuuid:string);
        getClinicTreatment(clinicuuid:string);
        acceptTreatment(id:string);
        rejectTreatment(id:string);
        assignTreatment(assignid:string,clinicuuid:string);
        unassignTreatment(unassignid:string,clinicuuid:string);
    //end



    //clinic packages
     getClinicPackages(id:string);

    //packages end

    //manage-packages
     getPackages(page: number, limit: number);
     getpackagesDetails(id:string);   

    //wnd


    

    
}