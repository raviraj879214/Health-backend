import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards, Version } from "@nestjs/common";
import { REQUESTCONST } from "../constant/request.constant";
import { RequestServices } from "./request.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { RequestFundsCreateDto } from "./dto/request.create.dto";












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


    @UseGuards(JwtAuthGuard)
    @Get("patient-query-details/:patientqueryid")
    @Version("1")
    async getPatientQueryDetails(@Param("patientqueryid") patientqueryid:string){

        return await this.requestservices.getPatientQueryDetails(patientqueryid);
    }



    @UseGuards(JwtAuthGuard)
    @Post("clinic-request-fund")
    @Version("1")
    async requestFunds(@Body() dto:RequestFundsCreateDto){
        return await this.requestservices.RequestFunds(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("get-clinic-request-fund/:patientqueryid")
    @Version("1")
    async getRequestFunds(@Param("patientqueryid") patientqueryid:string){
        
        return await this.requestservices.GEtRequestFunds(patientqueryid);
    }







}