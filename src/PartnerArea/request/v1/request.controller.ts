import { Body, Controller, Get, Inject, Query, Req, UseGuards, Version } from "@nestjs/common";
import { REQUESTCONST } from "../constant/request.constant";
import { RequestServices } from "./request.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";












@Controller("/api/manage-clinic-request")
export class RequestController{

    constructor(@Inject(REQUESTCONST) private readonly requestservices:RequestServices){}




    @UseGuards(JwtAuthGuard)
    @Get("clinic-request/:clinicuuid")
    @Version("1")
    async getClinicRequest(@Req() req,@Body("clinicuuid") clinicuuid:string,@Query('page') page: string,@Query('limit') limit: string){
            console.log("req.user.id",req.user.id);

             const pageNumber = parseInt(page) || 0;
            const pageSize = parseInt(limit) || 0;

        return await this.requestservices.getPatientQueryRequest(clinicuuid,req.user.id,pageNumber,pageSize);
    }





}