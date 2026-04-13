



export interface IAdditionalServices{

    getPatinetQuery(page: number, limit: number, adminid:number);

    createServices(service:string,description:string,price:number,patientqueryid:string);

    updateServiceStatus(id:string);


   updateService(id:string,label:string,description:string,price:string);


   deleteService(id:string);


   deletePaymentLink(id:string);
   

}