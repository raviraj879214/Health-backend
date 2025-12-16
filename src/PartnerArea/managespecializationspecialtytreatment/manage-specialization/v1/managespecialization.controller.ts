import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { MANAGE_SPECIALIZATION_CONSTANT } from "../constant/managespecialization.constant";
import { ManageClinicSpecializationsServices } from "./managespecialization.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ClinicSpecializationUpdateDto } from "./dto/managespecialization.update.dto";



@Controller("/api/manage-clinic-specialization")
export class ManageClinicSpecializationController{

    constructor(@Inject(MANAGE_SPECIALIZATION_CONSTANT)private readonly manageClinicSpecializations:ManageClinicSpecializationsServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-specialization")
    @Version("1")
    async getSpecialization(){
        return this.manageClinicSpecializations.getSpecializations();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/get-clinic-specialization/:clinicuuid")
    @Version("1")
    async getClinicSpecialization(@Param("clinicuuid") clinicuuid:string){
        return this.manageClinicSpecializations.getClinicSpecializations(clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-specialization")
    @Version("1")
    async selectSpecilaizations(@Body() dto:ClinicSpecializationUpdateDto){
        return await this.manageClinicSpecializations.selectSpecialization(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-specialization")
    @Version("1")
    async deleteSpecilization(@Body() dto:ClinicSpecializationUpdateDto){
        return this.manageClinicSpecializations.deleteSpecilaization(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:ClinicSpecializationUpdateDto){

        return await this.manageClinicSpecializations.createOther(dto);
    }







}