import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { PACKAGE_STEP_THREE_CONSTANT } from "../constant/packagestepthree.constatnt";
import { ManagePackageSpecialtyServices } from "./packagestepthree.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PackageSpecialityUpdateDto } from "./dto/packagestepthree.update.dto";





@Controller("/api/manage-package-specialty")
export class ManagePackageSpecialityController{


    constructor(@Inject(PACKAGE_STEP_THREE_CONSTANT)private readonly managePackageSpeciality:ManagePackageSpecialtyServices){}


    @UseGuards(JwtAuthGuard)
    @Get("/get-specialty")
    @Version("1")
    async getspecialty(){
        return this.managePackageSpeciality.getSpecialitys();
    }


    
    @UseGuards(JwtAuthGuard)
    @Get("/get-package-specialty/:packageid")
    @Version("1")
    async getClinicspecialty(@Param("packageid") packageid:string){
        return this.managePackageSpeciality.getPackageSpecialitys(packageid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/choose-specialty")
    @Version("1")
    async selectSpecilaizations(@Body() dto:PackageSpecialityUpdateDto){
        return await this.managePackageSpeciality.selectSpeciality(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/delete-specialty")
    @Version("1")
    async deleteSpecilization(@Body() dto:PackageSpecialityUpdateDto){
        return this.managePackageSpeciality.deleteSpecilaity(dto);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/create-other")
    @Version("1")
    async createOther(@Body() dto:PackageSpecialityUpdateDto){

        return await this.managePackageSpeciality.createOther(dto);
    }

}