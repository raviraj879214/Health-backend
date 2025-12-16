import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { DOCTOR_SPECIALTY_SERVICE_CONSTANT } from "../constant/doctorspecialty.constant";
import { DoctorSpecilatyService } from "./doctorspecialty.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorSpecialtyUpdateDto } from "./dto/doctorspecialty.update.dto";






@Controller("/api/doctor-specialty")
export class DoctorSpecialtyController {
    constructor(@Inject(DOCTOR_SPECIALTY_SERVICE_CONSTANT)private readonly doctorspecialtService:DoctorSpecilatyService){}


        @UseGuards(JwtAuthGuard)
        @Get("/get-specialty")
        @Version("1")
        async getSpecilatyList(){

            return await this.doctorspecialtService.getSpecialty();
        }


        @UseGuards(JwtAuthGuard)
        @Get("/chose-specialty/:doctoruuid")
        @Version("1")
        async choseSpecializationList(@Param("doctoruuid") doctoruuid:string)
        {
            return await this.doctorspecialtService.selectedSpecialty(doctoruuid);
        }



             @UseGuards(JwtAuthGuard)
            @Delete("/remove-specialty/:id")
            @Version("1")
            async removeSpecializations(@Param("id") id:string){
                 return this.doctorspecialtService.removeSpecialty(id);
            }
        
            @UseGuards(JwtAuthGuard)
            @Post("/choose-specialty")
            @Version("1")
            async selectSpecilaizations(@Body() dto:DoctorSpecialtyUpdateDto){
                console.log("dto",dto);
                return await this.doctorspecialtService.selectSpecialty(dto);
            }
        
            @UseGuards(JwtAuthGuard)
            @Post("/delete-specialty")
            @Version("1")
            async deleteSpecilization(@Body() dto:DoctorSpecialtyUpdateDto){
                
                return this.doctorspecialtService.deleteSpecialty(dto);
            }

            

            @UseGuards(JwtAuthGuard)
            @Post("/create-other")
            @Version("1")
            async createOther(@Body() dto:DoctorSpecialtyUpdateDto){
        
                
                return await this.doctorspecialtService.createOther(dto);
            }
            








}