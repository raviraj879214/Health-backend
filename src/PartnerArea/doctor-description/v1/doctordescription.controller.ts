import { Body, Controller, Get, Inject, Param, Put, UseGuards, Version } from "@nestjs/common";
import { DOCTOR_DESCRIPTIONS_SERVICE_CONSTANT } from "../constant/doctordescription.constant";
import { DoctorDescriptionService } from "./doctordescription.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorDescriptionUpdateDto } from "./dto/doctordescription.update.dto";









@Controller("/api/doctor-description")

export class DoctorDescriptionController{
    constructor(@Inject(DOCTOR_DESCRIPTIONS_SERVICE_CONSTANT)private readonly doctordescriptionService:DoctorDescriptionService){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-doctor-description/:doctoruuid")
    @Version("1")
    async getDoctorDescription(@Param("doctoruuid") doctoruuid : string){

        return this.doctordescriptionService.getDescription(doctoruuid);
    }


    @UseGuards(JwtAuthGuard)
    @Put("/update-doctor-description")
    @Version("1")
    async updateDoctorDescription(@Body() dto:DoctorDescriptionUpdateDto ) {

        
        return this.doctordescriptionService.updatedescription(dto);
    }







}