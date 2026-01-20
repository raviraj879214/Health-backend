



export interface IManageDoctor {

    getDoctorDetails(id:string);
    getDoctorSurgeryImages(id:string);
    getDoctorsClinic(id:string);



    //doctor specialty
        getSpecialty(doctoruuid:string);
        getDoctorSpecialty(doctoruuid:string);
        acceptSpecailty(id:string,doctoruuid:string);
        rejectSpecailty(id:string,doctoruuid:string);
        
        assignSpecialty(assignid:string,doctoruuid:string);
        unassignSpecialty(unassignid:string,doctoruuid:string);
    //end




    //doctor sub specialty
        getSubSpecialty(doctoruuid:string);
        getDoctorSubSpecialty(doctoruuid:string);
        acceptSubSpecailty(id:string,doctoruuid:string);
        rejectSubSpecailty(id:string,doctoruuid:string);
        assignSubSpecialty(assignid:string,doctoruuid:string);
        unassignSubSpecialty(unassignid:string,doctoruuid:string);
    //end




        //clinic treatment
        getTreatment(doctoruuid:string);
        getDoctorTreatment(doctoruuid:string);
        acceptTreatment(id:string,doctoruuid:string);
        rejectTreatment(id:string,doctoruuid:string);
        assignTreatment(assignid:string,doctoruuid:string);
        unassignTreatment(unassignid:string,doctoruuid:string);
    //end



    doctorUpdateStatus(status:string,doctoruuid:string,reason:string);


    

}
