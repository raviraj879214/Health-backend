import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { DOCTOR_CONSTANT_SERVICES } from "../constant/doctor.constant";
import { DoctorServices } from "./doctor.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorCreateDto } from "./dto/doctor.create.dto";
import type { DoctorRequest } from "./dto/doctorrequest";
import { DoctorAddress, DoctorUpdateDto } from "./dto/doctor.update.dto";








@Controller("/api/doctors")
export class DoctorController {


    constructor(@Inject(DOCTOR_CONSTANT_SERVICES)private readonly doctorServices:DoctorServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-doctors/:clinicuuid")
    @Version("1")
    async getDoctors(@Param("clinicuuid") clinicuuid:string){
        console.log("clinicuuid",clinicuuid);
        return await this.doctorServices.getDoctors(clinicuuid);
    }




     @UseGuards(JwtAuthGuard)
     @Post("/create-doctor")
     @Version("1")
     async createDoctor(@Req() dto:DoctorRequest){
        const file = dto.file;
        const image_url = file ? `${file.filename}` : null;

        console.log("imagePath",image_url);
        const {firstname,lastname,email,dob,crm,languages,videourl,doctoruuid,clinicuuid ,cpf , degree} = dto.body ?? {};
        console.log("dto crm",firstname);
        const updateDoctor : DoctorUpdateDto = {firstname : firstname,lastname : lastname,email : email,dob:dob,crm:crm,languages:languages,videourl : videourl ,doctoruuid:doctoruuid,clinicuuid:clinicuuid,...(image_url && { image_url }) ,cpf:cpf ,degree:degree };
        console.log("updateDoctor",updateDoctor);


        return await this.doctorServices.createUpdateDoctor(updateDoctor);         
     }


     @UseGuards(JwtAuthGuard)
     @Get("/doctor-details/:doctoruuid")
     @Version("1")
     async getDoctorDetails(@Param("doctoruuid") doctoruuid:string){

         console.log("doctoruuid",doctoruuid);
        return await this.doctorServices.getDoctorDetails(doctoruuid);
     }
     

     @UseGuards(JwtAuthGuard)
     @Get("/global-doctor-list/:clinicUuid")
     @Version("1")
     async getGlobaldata(@Param("clinicUuid") clinicUuid:string){

        return this.doctorServices.getGlobalDoctorsList(clinicUuid);
     }


    @UseGuards(JwtAuthGuard)
    @Post("/assign-doctor-clinic")
    @Version("1")
    async assignClinic(@Body() dto: DoctorUpdateDto) {


        return this.doctorServices.assignDoctorsClinic(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Get("get-clinic-address/:clinicuuid")
    @Version("1")
    async getClinicAddress(@Param("clinicuuid") clinicuuid:string) {
        return this.doctorServices.getClinicAddress(clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("update-clinic-address")
    @Version("1")
    async updateClinicAddress(@Body() dto:DoctorAddress) {
      
        return await this.doctorServices.updateDoctorAddress(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("get-doctor-address")
    @Version("1")
    async getDoctorAddress(@Body() dto:{clinicuuid:string,doctoruuid:string}) {
      
       return await this.doctorServices.getDoctorAddress(dto.clinicuuid,dto.doctoruuid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("submit-doctor")
    @Version("1")
    async submitDoctors(@Body() dto:{clinicuuid:string,doctoruuid:string}) {
        
        console.log("final submit",dto);
       return await this.doctorServices.submitDoctor(dto.clinicuuid,dto.doctoruuid);
    }

























}