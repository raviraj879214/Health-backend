import { Body, Controller, Get, Inject, Put, Query, Req, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ClinicDetailServices } from "./clinicdetails.service";
import { CLINICDETAILSCONSTANT } from "../constant/clinicdetails.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";









@UseGuards(RolesGuard)
@Controller("/api/clinic-details")
export class ClinicDetailsController{
    constructor(@Inject(CLINICDETAILSCONSTANT) private readonly clinicdetailServices:ClinicDetailServices){}


    @Get("get-clinic-list")
    @ModuleAccess("Manage Clinic Details Page Seo")
    @Version("1")
    async getManageSpecialties(@Req() request: AuthRequest) {
        const userId = Number(request.user?.sub);
        return await this.clinicdetailServices.getClinicList();
    }

        

    @Put("update-seo-clinic-details")
     @ModuleAccess("Manage Clinic Details Page Seo")
    @Version("1")
    async updateSeoClinicDetails(@Body() dto:{metatitle:string,metakeywords:string,metadescription:string,slug:string,uuid:string}){


        return await this.clinicdetailServices.updateSeoClinicDetails(dto.metatitle,dto.metakeywords,dto.metadescription,dto.slug,dto.uuid);
    }




}