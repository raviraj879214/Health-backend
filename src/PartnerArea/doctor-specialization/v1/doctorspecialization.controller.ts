import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { DOCTOR_SPECIALIZATION_SERVICE_CONSTANT } from "../constant/doctorspecialization.constant";
import { DoctorSpecializationService } from "./doctorspecialization.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorSpecializationUpdateDto } from "./dto/doctorspecialization.update.dto";










@Controller("/api/doctor-specialization")
export class DoctorSpecializationController {
    constructor(@Inject(DOCTOR_SPECIALIZATION_SERVICE_CONSTANT)private readonly doctorspecializationService:DoctorSpecializationService){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-specialization")
    @Version("1")
    async getSpecializationList()
    {
        return await this.doctorspecializationService.getSpecilization();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/chose-specialization/:doctoruuid")
    @Version("1")
    async choseSpecializationList(@Param("doctoruuid") doctoruuid:string)
    {
        return await this.doctorspecializationService.selectedSpecialization(doctoruuid);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/remove-specialization/:id")
    @Version("1")
    async removeSpecializations(@Param("id") id:string){
        return this.doctorspecializationService.removeSpecialization(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/choose-specialization")
    @Version("1")
    async selectSpecilaizations(@Body() dto:DoctorSpecializationUpdateDto){
        console.log("dto",dto);
        return await this.doctorspecializationService.selectSpecialization(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/delete-specialization")
    @Version("1")
    async deleteSpecilization(@Body() dto:DoctorSpecializationUpdateDto){
        
        return this.doctorspecializationService.deleteSpecilaization(dto);
    }
    

    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:DoctorSpecializationUpdateDto){

        
        return await this.doctorspecializationService.createOther(dto);
    }

















}