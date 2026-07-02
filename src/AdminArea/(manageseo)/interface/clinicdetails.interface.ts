


export interface IClinicDetails{

    getClinicList();

    updateSeoClinicDetails(metatitle:string,metakeyword:string,metadescription:string,slug,uuid:string);



    getCms();

    postCms(id:string,content:string);
    
}