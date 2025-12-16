import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { PACKAGE_STEP_DOCTOR_CONSTANT } from "../constant/packagestepfive.constant";
import { ManagePackageDoctorServices } from "./packagestepfive.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PackageStepDoctorUpdateDto } from "./dto/packagestepfive.update.dto";





@Controller("/api/manage-package-doctor")
export class ManagePackageDoctorController{

    constructor(@Inject(PACKAGE_STEP_DOCTOR_CONSTANT)private readonly managePackageDoctor:ManagePackageDoctorServices){}



    @UseGuards(JwtAuthGuard)
    @Get("/get-selected-doctor/:packageid")
    @Version("1")
    async getSelectedDoctor(@Param("packageid") packageid:string){


        return await this.managePackageDoctor.getSelectedDoctor(packageid);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/selected-doctor")
    @Version("1")
    async selectedDoctor(@Body() dto:PackageStepDoctorUpdateDto){

        return await this.managePackageDoctor.selectDoctor(dto);
    }





}