

export interface IManageSpecialties{


    getSpecilaties(page:number,limit:number,userid:number);

    createSpecialties(name:string,userid:number);

    updateSpecialties(id:string,name:string,userid:number);

    deleteSpecialties(id:string,userId:number);




}