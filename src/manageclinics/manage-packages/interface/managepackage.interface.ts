import { SendMessageCreateDto } from "../v1/dto/managepackage.create.dto";




export interface IManagePackage{


    //package specialty
        getSpecialty(packageid:string);
        getPackageSpecialty(packageid:string);
        acceptSpecailty(id:string,packageid:string);
        rejectSpecailty(id:string,packageid:string);
        assignSpecialty(assignid:string,packageid:string);
        unassignSpecialty(unassignid:string,packageid:string);
    //end


      //clinic specialty
        getSubSpecialty(packageid:string);
        getPackageSubSpecialty(packageid:string);
        acceptSubSpecailty(id:string,packageid:string);
        rejectSubSpecailty(id:string,packageid:string);
        assignSubSpecialty(assignid:string,packageid:string);
        unassignSubSpecialty(unassignid:string,packageid:string);
    //end


     //clinic treatment
        getTreatment(packageid:string);
        getPackageTreatment(packageid:string);
        acceptTreatment(id:string,packageid: string);
        rejectTreatment(id:string,packageid: string);
        assignTreatment(assignid:string,packageid:string);
        unassignTreatment(unassignid:string,packageid:string);
    //end



    //clinic Procedure
        getProcedure(packageid:string);
        getPackageProcedure(packageid:string);
        acceptProcedure(id:string,packageid: string);
        rejectProcedure(id:string,packageid: string);
        assignProcedure(assignid:string,packageid:string);
        unassignProcedure(unassignid:string,packageid:string);
    //end


     sendMessageToClinic(dto:SendMessageCreateDto);




    
}