import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { PACKAGE_TWO_CONSTATNT } from "../constant/packagesteptwo.constant";
import { ManagePackageSpecializationsServices } from "./packagesteptwo.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PackageSpecializationUpdateDto } from "./dto/packagesteptwo.update.dto";




@Controller("/api/manage-package-specialization")
export class ManagePackageSpecializationController{

    constructor(@Inject(PACKAGE_TWO_CONSTATNT)private readonly managePackageSpecializations:ManagePackageSpecializationsServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-specialization")
    @Version("1")
    async getSpecialization(){
        return this.managePackageSpecializations.getSpecializations();
    }


    
    @UseGuards(JwtAuthGuard)
    @Get("/get-package-specialization/:packageid")
    @Version("1")
    async getClinicSpecialization(@Param("packageid") packageid:string){
        return this.managePackageSpecializations.getPackageSpecializations(packageid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-specialization")
    @Version("1")
    async selectSpecilaizations(@Body() dto:PackageSpecializationUpdateDto){
        return await this.managePackageSpecializations.selectSpecialization(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-specialization")
    @Version("1")
    async deleteSpecilization(@Body() dto:PackageSpecializationUpdateDto){
        return this.managePackageSpecializations.deleteSpecilaization(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:PackageSpecializationUpdateDto){

        return await this.managePackageSpecializations.createOther(dto);
    }







}