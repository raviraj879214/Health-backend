import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { ACCREDITATION_CONSTANT_SERVICE } from "../constant/accreditation.constant";
import { AccreditationService } from "./accreditation.services";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { AccreditationsCreateDto } from "./dto/accreditation.update.dto";
import type { LicenseRequest } from "./dto/license.request";




@Controller("/api/manage-accreditation")
export class AccreditationController{
    constructor(@Inject(ACCREDITATION_CONSTANT_SERVICE)private readonly accreditationservice:AccreditationService){}



    @UseGuards(JwtAuthGuard)
    @Get("/get-all-accreditation")
    @Version("1")
    async getAccreditations(){
        return await this.accreditationservice.getAllAccreditation();
    }


    @UseGuards(JwtAuthGuard)
    @Get("/get-selected-accreditation/:clinicuuid")
    @Version("1")
    async getSelectedAccreditations(@Param("clinicuuid") clinicuuid:string){
        console.log("clinicuuid",clinicuuid);
        return await this.accreditationservice.getSelectedAccreditation(clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/insert-accreditation")
    @Version("1")
    async insertSelectedAccreditations(@Body() dto:AccreditationsCreateDto){

        console.log(dto);

        return await this.accreditationservice.createSelectedAccreditations(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("/delete-accreditation/:id")
    @Version("1")
    async  deleteAcreditationsSelected(@Param("id") id : number){
        

            return this.accreditationservice.deleteAccreditation(id);
    }


    @UseGuards(JwtAuthGuard)
    @Post("upload-license")
    @Version("1")
    async uploadLicense(@Req() dto: LicenseRequest) {
        const file = dto.file;
        const image_url = (dto as any).fileName ?? null;
        console.log("imagePath", image_url);
        console.log("clinicuuid", dto.body?.clinicuuid);

        return await this.accreditationservice.createLicense(image_url,dto.body?.clinicuuid);
    }


    @UseGuards(JwtAuthGuard)
    @Get("get-license/:id")
    @Version("1")
    async getLicense(@Param("id") id:string) {
       
        return await this.accreditationservice.getLicense(id);
    }




    @UseGuards(JwtAuthGuard)
    @Delete("delete-license/:id")
    @Version("1")
    async deleteLicense(@Param("id") id:string) {
       
        return await this.accreditationservice.deleteLicense(id);
    }















}