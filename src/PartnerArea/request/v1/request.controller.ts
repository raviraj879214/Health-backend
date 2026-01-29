import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards, Version } from "@nestjs/common";
import { REQUESTCONST } from "../constant/request.constant";
import { RequestServices } from "./request.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { RequestFundsCreateDto } from "./dto/request.create.dto";
import { post } from "axios";












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


    @UseGuards(JwtAuthGuard)
    @Get("get-clinic-places-id/:input")
    @Version("1")
    async getPlacesID(@Param("input") input:string){
        console.log("input serached for",input);
        return await this.requestservices.getPalcesid(input);
    }

    
    @UseGuards(JwtAuthGuard)
    @Post("update-google-company")
    @Version("1")
    async updateGooglePlacesID(@Body() dto:{placesid:string,uuid:string}){
        return await this.requestservices.updateGooglePlacesID(dto);
    }



    @UseGuards(JwtAuthGuard)
    @Get("get-google-places-details/:placesid")
    @Version("1")
    async getGooglePlaces(@Param("placesid") placesid:string){
        return await this.requestservices.getGooglePlaces(placesid);
    }










}