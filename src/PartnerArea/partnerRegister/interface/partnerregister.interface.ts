import { PartnerRegisterClinicDetails, partnerRegisterCreateDto } from "../v1/dto/partnerregister.update.dto";





export interface IPartnerRegister{
    


    validateEmailAndOtp(email:string);


    updateOtpServices(dto:partnerRegisterCreateDto);

    getClinicUserDetail(uuid:string);


    insertClinicUserDetails(dto:partnerRegisterCreateDto);


    getClinicDetails(uuid:string);

    insertClinicDetails(dto:PartnerRegisterClinicDetails);


    getCountryCity();








}