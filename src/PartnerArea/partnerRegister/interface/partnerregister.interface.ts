import { partnerRegisterCreateDto } from "../v1/dto/partnerregister.update.dto";





export interface IPartnerRegister{
    


    validateEmailAndOtp(email:string);


    updateOtpServices(dto:partnerRegisterCreateDto);

    getClinicUserDetail(uuid:string);


    insertClinicUserDetails(dto:partnerRegisterCreateDto);











}