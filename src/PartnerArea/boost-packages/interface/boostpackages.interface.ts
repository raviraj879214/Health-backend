




export interface IBoostPackages{

    getBoostPackages();

    getClinicPackage(clinicuserid:string);


    insertClinicBoost(sessionId:string);

    
    getCurrentClinicPackages(clinicuserid:string);
    
}