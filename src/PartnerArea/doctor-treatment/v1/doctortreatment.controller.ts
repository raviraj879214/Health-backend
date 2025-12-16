import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { DOCTOR_TREATMENT_CONST_SERVICE } from "../constant/doctortreatment.constant";
import { DoctorTreatmentService } from "./doctortreatment.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorTreatmentDtoUpdate } from "./dto/doctortreatment.update.dto";








@Controller("/api/doctor-treatment")
export class DoctorTreatmentController{

     constructor(@Inject(DOCTOR_TREATMENT_CONST_SERVICE)private readonly doctortreatmentServices:DoctorTreatmentService){}




       @UseGuards(JwtAuthGuard)
             @Get("/get-treatment")
             @Version("1")
             async getTreatmentList(){
     
                 return await this.doctortreatmentServices.getTreatment();
             }
     
     
             @UseGuards(JwtAuthGuard)
             @Get("/chose-treatment/:doctoruuid")
             @Version("1")
             async choseTreatmentList(@Param("doctoruuid") doctoruuid:string)
             {
                 return await this.doctortreatmentServices.selectedTreatment(doctoruuid);
             }
     
     
     
                  @UseGuards(JwtAuthGuard)
                 @Delete("/remove-treatment/:id")
                 @Version("1")
                 async removeTreatments(@Param("id") id:string){
                      return this.doctortreatmentServices.removeTreatment(id);
                 }
             
                 @UseGuards(JwtAuthGuard)
                 @Post("/choose-treatment")
                 @Version("1")
                 async selectTreatments(@Body() dto:DoctorTreatmentDtoUpdate){
                     console.log("dto",dto);
                     return await this.doctortreatmentServices.selectTreatment(dto);
                 }
             
                 @UseGuards(JwtAuthGuard)
                 @Post("/delete-treatment")
                 @Version("1")
                 async deleteTreatment(@Body() dto:DoctorTreatmentDtoUpdate){
                     
                     return this.doctortreatmentServices.deleteTreatment(dto);
                 }
     
                 
     
                 @UseGuards(JwtAuthGuard)
                 @Post("/create-other")
                 @Version("1")
                 async createOther(@Body() dto:DoctorTreatmentDtoUpdate){
             
                     return await this.doctortreatmentServices.createOther(dto);
                 }
     


        





}