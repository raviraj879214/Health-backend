



export interface IPatietnQuery{
    
    getSpecialties();

    sendEmailOtp(email:string);


    getCordinatorDetails(clinicid:string);

     sendOtp(phone: string, otp: string);

}