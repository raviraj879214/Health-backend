import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { PACKAGE_STEP_FIVE_CONSTANT } from "../constant/packagestepfive.constant";
import { ManagePackageProcedureServices } from "./packagestepfive.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PackageStepFiveUpdateDto } from "./dto/packagestepfive.update.dto";




@Controller("/api/manage-package-procedure")
export class ManagePackageProcedureController{

    constructor(@Inject(PACKAGE_STEP_FIVE_CONSTANT)private readonly managePackageProcedure:ManagePackageProcedureServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-procedure")
    @Version("1")
    async getSpecialization(){
        return this.managePackageProcedure.getProcedure();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/get-package-procedure/:packageid")
    @Version("1")
    async getClinicSpecialization(@Param("packageid") packageid:string){
        return this.managePackageProcedure.getPackageProcedure(packageid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-procedure")
    @Version("1")
    async selectSpecilaizations(@Body() dto:PackageStepFiveUpdateDto){
        return await this.managePackageProcedure.selectProcedure(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-procedure")
    @Version("1")
    async deleteSpecilization(@Body() dto:PackageStepFiveUpdateDto){
        return this.managePackageProcedure.deleteProcedure(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:PackageStepFiveUpdateDto){

        return await this.managePackageProcedure.createOther(dto);
    }




}