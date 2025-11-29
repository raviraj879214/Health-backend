import { Body, Controller, Get, Inject, Param, Put, UseGuards, Version } from "@nestjs/common";
import { MANAGE_CLINIC_SERVICES_V1 } from "src/PartnerArea/Manage-Clinics/constant/manage.clinic.constant";
import { ClinicDescriptionService } from "./clinicdescription.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ClinicDescritptionUpdateDto } from "./dto/clinicdescription.update.dto";






@Controller("/api/manage-clinic-description")
export class ClinicDescriptionController{

    constructor(@Inject(MANAGE_CLINIC_SERVICES_V1)private readonly clinicdescriptionservice:ClinicDescriptionService){}

    @UseGuards(JwtAuthGuard)
    @Get("/get-clinic-description/:clinicuuid")
    @Version("1")
    async getClinicDescription(@Param("clinicuuid") clinicuuid: string)
    {
        return this.clinicdescriptionservice.getClinicDescription(clinicuuid);
    }



    @UseGuards(JwtAuthGuard)
    @Put("/update-clinic-description")
    @Version("1")
    async updateClinicDescription(@Body() dto: ClinicDescritptionUpdateDto){


        console.log("details",dto);

        
        return await this.clinicdescriptionservice.createupdateClinicDescription(dto);

    }










}