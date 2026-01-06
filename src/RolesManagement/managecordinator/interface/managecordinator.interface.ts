


export interface IManageCordinator{

    getCordinator();
    getClinicList();

    getSelectedClinc(id:number);


    assignClinctoCordinator(clinciid:string , id:number);

    removeClinic(id:string);

}