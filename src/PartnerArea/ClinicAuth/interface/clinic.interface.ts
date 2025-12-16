import { updateClinicUser } from "../v1/dto/clinic.update.dt";




export interface IClinicAuthService{

    validateUser(email: string, pass: string);

    login(email: string, password: string);

    createClinicUser(data: { email: string; password: string; phone?: string });
    
    verifyToken(token: string);

    logout(userId: string);


    getClinicProfile(id);


    updateClinicAccount(id,dto:updateClinicUser);


    partnerForgot(email:string);


    resetPassword(email:string,password:string);

    checkresetTokenExist(token:string,email:string);





}