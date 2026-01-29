import { Controller, Get, Inject, UseGuards, Version , Request, Param, Body, Post, Put } from "@nestjs/common";

import { MANAGE_CLINIC_SERVICES_V1 } from "../constant/manage.clinic.constant";
import { ManageClinicService } from "./manageclinic.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ClinicGoogleMap, ManageClinicDto } from "./dto/manageclinic.update.dto";
import { version } from "os";





@Controller("/api/manage-clinic")
export class ManageClinicController{

    constructor(@Inject(MANAGE_CLINIC_SERVICES_V1)private readonly manageClinicService : ManageClinicService){}


    @UseGuards(JwtAuthGuard)
    @Get("get-clinics")
    @Version("1")
    async GetClincsList(@Request() req){

         return this.manageClinicService.get(req.user.id);
    }


    
    @UseGuards(JwtAuthGuard)
    @Get("get-clinics-details/:id")
    @Version("1")
    async GetClinicsDetails(@Param("id") id: string)
    {
        

            return this.manageClinicService.getClinicDetails(id); 
    }

    @UseGuards(JwtAuthGuard)
    @Put("update-clinics-name")
    @Version("1")
    async UpdateClinicName(@Body() dto: ManageClinicDto){
        return this.manageClinicService.updateClinicName(dto);
    }



    @Post("update-clinics-map")
    @Version("1")
    async UpdateClinicMap(@Body() dto: ClinicGoogleMap){
        return this.manageClinicService.updateClinicMap(dto);
    }


    @Post('ping-admin')
    @Version("1")
    async pingAdmin(@Body() dto:{clinicmessage : string }){

        return await this.manageClinicService.pingAdmin(dto.clinicmessage);
    }














}