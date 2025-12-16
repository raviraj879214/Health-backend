import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { PACKAGE_STEP_FOUR_CONSTANT } from "../constant/packagestepfour.constant";
import { ManagePackageTreatmentServices } from "./packagestepfour.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PackageTreatmentUpdateDto } from "./dto/packagestepfour.update.dto";








@Controller("/api/manage-package-treatment")
export class ManagePackageTreatmentController{

    constructor(@Inject(PACKAGE_STEP_FOUR_CONSTANT)private readonly managePackageTreatment:ManagePackageTreatmentServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-treatment")
    @Version("1")
    async getSpecialization(){
        return this.managePackageTreatment.getTreatments();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/get-package-treatment/:packageid")
    @Version("1")
    async getClinicSpecialization(@Param("packageid") packageid:string){
        return this.managePackageTreatment.getPackageTreatments(packageid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-treatment")
    @Version("1")
    async selectSpecilaizations(@Body() dto:PackageTreatmentUpdateDto){
        return await this.managePackageTreatment.selectTreatment(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-treatment")
    @Version("1")
    async deleteSpecilization(@Body() dto:PackageTreatmentUpdateDto){
        return this.managePackageTreatment.deleteTreatments(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:PackageTreatmentUpdateDto){

        return await this.managePackageTreatment.createOther(dto);
    }







}