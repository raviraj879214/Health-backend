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



    @UseGuards(JwtAuthGuard)
    @Post("submit-package")
    @Version("1")
    async submitPackage(@Body() dto:{packageid:string}){

        
        return await this.managePackageDoctor.submitPackage(dto.packageid);
    }



    @UseGuards(JwtAuthGuard)
    @Post("update-visibilty")
    @Version("1")
    async updateVisibity(@Body() dto:{packageid:string,status:string}){
            console.log("status package",dto);
        
        return await this.managePackageDoctor.updateVisibilty(dto.packageid,Number(dto.status));
    }



    @UseGuards(JwtAuthGuard)
    @Get("/get-doctors/:clinicuuid")
    @Version("1")
    async getDoctors(@Param("clinicuuid") clinicuuid:string){
        console.log("doctor from package",clinicuuid);
        return await this.managePackageDoctor.getDoctors(clinicuuid);
    }

    



}