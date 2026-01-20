import { PartnerRegisterClinicDetails, partnerRegisterCreateDto } from "../v1/dto/partnerregister.update.dto";





export interface IPartnerRegister{
    


    validateEmailAndOtp(email:string);


    updateOtpServices(dto:partnerRegisterCreateDto);

    getClinicUserDetail(uuid:string);


    insertClinicUserDetails(dto:partnerRegisterCreateDto);


    getClinicDetails(uuid:string);

    insertClinicDetails(dto:PartnerRegisterClinicDetails);

    insertMoreClinicDetails(dto:PartnerRegisterClinicDetails);


    getCountryCity();

    sendOtp(phone: string, otp: string)

    verifyOtp(clinicid:string,phoneverify:string);
    

    accepttermsCondition(dto:PartnerRegisterClinicDetails);


    getTermsCondition(name:string);

    
}