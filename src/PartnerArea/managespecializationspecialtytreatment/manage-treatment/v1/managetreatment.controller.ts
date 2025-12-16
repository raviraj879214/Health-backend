import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { MANAGE_CLINIC_TREATMENT } from "../constant/managetreatment.constant";
import { ManageClinicTreatmentServices } from "./managetreatment.service";
import { ClinicTreatmentUpdateDto } from "./dto/managetreatment.update.dto";


@Controller("/api/manage-clinic-treatment")
export class ManageClinicTreatmentController{

    constructor(@Inject(MANAGE_CLINIC_TREATMENT)private readonly manageClinicTreatment:ManageClinicTreatmentServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-treatment")
    @Version("1")
    async getSpecialization(){
        return this.manageClinicTreatment.getTreatments();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/get-clinic-treatment/:clinicuuid")
    @Version("1")
    async getClinicSpecialization(@Param("clinicuuid") clinicuuid:string){
        return this.manageClinicTreatment.getClinicTreatments(clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-treatment")
    @Version("1")
    async selectSpecilaizations(@Body() dto:ClinicTreatmentUpdateDto){
        return await this.manageClinicTreatment.selectTreatment(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-treatment")
    @Version("1")
    async deleteSpecilization(@Body() dto:ClinicTreatmentUpdateDto){
        return this.manageClinicTreatment.deleteTreatments(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:ClinicTreatmentUpdateDto){

        return await this.manageClinicTreatment.createOther(dto);
    }







}