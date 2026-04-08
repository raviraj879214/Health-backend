import { Body, Controller, Get, Inject, Post, Put, Query, Req, UseGuards, Version } from "@nestjs/common";
import { ADDITIONALSERVICES } from "../constant/additionalservices.constant";
import { AdditionalServices } from "./additionalservices.services";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";









@Controller("/api/additonal-services")
@UseGuards(RolesGuard)
export class AdditonalServicesController{
    constructor(@Inject(ADDITIONALSERVICES) private readonly additonalServices:AdditionalServices){}



    @Get("get-patient-queries")
    @Version("1")
    @ModuleAccess("Manage Patient Queries")
    async getPatientQuereis(@Query('page') page: string, @Query('limit') limit: string, @Req() request: AuthRequest) {

        const userId = request.user?.sub;

        const pageNumber = parseInt(page) || 0;
        const pageSize = parseInt(limit) || 0;

        return await this.additonalServices.getPatinetQuery(pageNumber, pageSize, Number(userId));
    }


    @Post("create-service")
    @Version("1")
    @ModuleAccess("Manage Patient Queries")
    async createServices(@Body() dto:{service:string ,description:string,price:string,patientqueryid:string}){

        return await this.additonalServices.createServices(dto.service,dto.description,Number(dto.price),dto.patientqueryid);
    }


    @Put("update-service-status")
    @Version("1")
    @ModuleAccess("Manage Patient Queries")
    async updateServiceStatus(@Body() dto:{id:string}){

        return await this.additonalServices.updateServiceStatus(dto.id);
    }



   


}