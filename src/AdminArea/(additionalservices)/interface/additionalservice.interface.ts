



export interface IAdditionalServices{

    getPatinetQuery(page: number, limit: number, adminid:number);

    createServices(service:string,description:string,price:number,patientqueryid:string);

    updateServiceStatus(id:string);


    
}