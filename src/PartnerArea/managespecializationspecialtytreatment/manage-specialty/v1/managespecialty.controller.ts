import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { MANAGE_SPECIALTY_CONSTANT } from "../constant/managespecialty.constant";
import { ManageSpecialtyServices } from "./managespecialty.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ClinicSpecialityUpdateDto } from "./dto/managespecialty.update.dto";


@Controller("/api/manage-clinic-speciality")
export class ManageClinicSpecialityController{

    constructor(@Inject(MANAGE_SPECIALTY_CONSTANT)private readonly manageClinicSpeciality:ManageSpecialtyServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-speciality")
    @Version("1")
    async getSpecialization(){
        return this.manageClinicSpeciality.getSpecialitys();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/get-clinic-speciality/:clinicuuid")
    @Version("1")
    async getClinicSpecialization(@Param("clinicuuid") clinicuuid:string){
        return this.manageClinicSpeciality.getClinicSpecialitys(clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-speciality")
    @Version("1")
    async selectSpecilaizations(@Body() dto:ClinicSpecialityUpdateDto){
        return await this.manageClinicSpeciality.selectSpeciality(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-speciality")
    @Version("1")
    async deleteSpecilization(@Body() dto:ClinicSpecialityUpdateDto){
        return this.manageClinicSpeciality.deleteSpecilaity(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:ClinicSpecialityUpdateDto){

        return await this.manageClinicSpeciality.createOther(dto);
    }







}