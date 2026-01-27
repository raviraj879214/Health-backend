import { ManagePayoutUpdateDto } from "../v1/dto/manageapyout.update.dto";





export interface IManagePayout{

        getStripeAccountDetails(accountid:string);
        getClinicList();
        getClinicDetails(id:string);
        payoutClinic(dto:ManagePayoutUpdateDto);
        getTransferTransaction(dto:ManagePayoutUpdateDto);



        getPatientQuery(adminid:number);



        getPatinetQueryTransaction(patientqueryid:string);


        releaseFundVendor(verndoraccountid:string,patientqueryid:string,note:string,amount:string);

        

    
}