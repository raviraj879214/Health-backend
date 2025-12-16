import { Body, Controller, Delete, Get, Inject, Param, Post, Req, UseGuards, Version } from "@nestjs/common";
import { MANAGE_SURGERIES_CONSTANT_V1 } from "../constant/managesurgeries.constant";
import { ManageSurgeries } from "./managesurgeries.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ManageSurgeriesCreateDto } from "./dto/managesurgeries.create.dto";
import type { SurgeriesRequest } from "../request/ISurgeriesImagesrequest";



@Controller("/api/manage-surgeries")
export class ManageSurgeriesController{

    constructor(@Inject(MANAGE_SURGERIES_CONSTANT_V1)private readonly managesurgeries : ManageSurgeries ){}






        @UseGuards(JwtAuthGuard)
        @Get("get-surgeries-images/:id")
        @Version("1")
        async GetSurgeriesimages(@Param("id") id:string){
            return this.managesurgeries.getSurgeryImages(id);
        }


        @UseGuards(JwtAuthGuard)
        @Post("insert-surgeries-images")
        @Version("1")
        async InsertSurgeriesimages(@Req() requestbody : SurgeriesRequest){

            const file = requestbody.file;
            const image_url = file ? `${file.filename}` : null;
            console.log("imagePath",image_url);
            const { surgeryid = '',type = '' , doctorUuid ='' , clinicUuid = '',treatmentid ='' } = requestbody.body ?? {};
            console.log("treatmentid",treatmentid);
            console.log("type",type);

           const dto: ManageSurgeriesCreateDto = {
                imageUrl: image_url ?? undefined,
                surgeryId: surgeryid ?? undefined,
                type: type ?? undefined,
                doctorUuid : doctorUuid,
                clinicUuid : clinicUuid,
                treatmentid : treatmentid
            };
            return this.managesurgeries.addSurgeriesImages(dto);
        }


        @UseGuards(JwtAuthGuard)
        @Delete("delete-surgeries-images/:id")
        @Version("1")
        async deleteSurgeryImages(@Param("id") id : string){

                return this.managesurgeries.deleteSurgeriesImages(id);
        }

        @UseGuards(JwtAuthGuard)
        @Get("get-treatment")
        @Version("1")
        async getAllTreatment(){
            return this.managesurgeries.getTreatments();
        }


        @UseGuards(JwtAuthGuard)
        @Get("get-doctors/:clinicuuid")
        @Version("1")
        async getDoctorsByclinic(@Param("clinicuuid") clinicuuid:string){

            return this.managesurgeries.getDoctors(clinicuuid);
        }









}



