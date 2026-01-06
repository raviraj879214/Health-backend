import { Body, Controller, Get, Inject, Param, Put, Version } from "@nestjs/common";
import { MANAGECORDINATOR } from "../constant/managecordinator.constant";
import { ManageCordinatorServices } from "./managecordinator.service";









@Controller("/api/manage-cordinator")
export class ManageCordinatorController{
    constructor(@Inject(MANAGECORDINATOR) private readonly manageCordinatorServices:ManageCordinatorServices){}



    @Get("get-cordinators")
    @Version("1")
    async getCordinators(){
        return await this.manageCordinatorServices.getCordinator();
    }

    @Get("get-clinic-list")
    @Version("1")
    async getClinicList(){
        return await this.manageCordinatorServices.getClinicList();
    }


    @Get("get-selected-clinic/:id")
    @Version("1")
    async getSelectedClinic(@Param("id") id:number){
        return await this.manageCordinatorServices.getSelectedClinc(id);
    }



    @Put("assign-clinic-cordinator")
    @Version("1")
    async assignCordinatorClinic(@Body("id") id:number,@Body("clinicid") clinicid:string){
       
        return await this.manageCordinatorServices.assignClinctoCordinator(clinicid,id);
    }


    @Put("remove-clinic-cordinator")
    @Version("1")
    async removeCordinatorClinic(@Body("clinicid") clinicid:string){
       
        return await this.manageCordinatorServices.removeClinic(clinicid);
    }






}