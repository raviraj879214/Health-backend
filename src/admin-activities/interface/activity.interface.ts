

export interface IActivityService {




    getUserList(pageNumber:number,pageSize:number,userId: number, ipAddress: string, userAgent: string): any;


    getAdminActivity(userId : number) : any;


    
}


