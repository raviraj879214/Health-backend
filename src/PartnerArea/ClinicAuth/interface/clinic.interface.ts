



export interface IClinicAuthService{

    validateUser(email: string, pass: string);

    login(email: string, password: string);

    createClinicUser(data: { email: string; password: string; phone?: string });
    
    verifyToken(token: string);

}