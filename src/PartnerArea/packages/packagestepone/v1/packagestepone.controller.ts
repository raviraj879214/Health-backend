import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { PACKAGE_STEP_ONE_CONSTANT } from "../constant/packagestepone.constant";
import { PackageStepOneServices } from "./packagestepone.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PackageOneUpdateDto } from "./dto/packagestepone.update.dto";








@Controller("/api/manage-package-one")
export class PackageStepOneController{

    constructor(@Inject(PACKAGE_STEP_ONE_CONSTANT) private readonly packagesteponeService:PackageStepOneServices){}



    @UseGuards(JwtAuthGuard)
    @Get("/get-package-list/:clinicuuid")
    @Version("1")
    async getpackagelist(@Param("clinicuuid") clinicuuid:string){
        
        return await this.packagesteponeService.getPackageList(clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Get("/get-package-details/:id")
    @Version("1")
    async getpackagedetails(@Param("id") id:string){
        return await this.packagesteponeService.getPackageDetails(id);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/insert-package-details")
    @Version("1")
    async createPackageStepOne(@Body() dto:PackageOneUpdateDto){
       return await this.packagesteponeService.insertPackageStepOne(dto);
    }





    


}