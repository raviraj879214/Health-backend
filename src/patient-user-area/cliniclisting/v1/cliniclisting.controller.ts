import { Body, Controller, Get, Inject, Param, Post, Query, Version } from "@nestjs/common";
import { CLINIC_LISTING_CONSTANT } from "../constant/cliniclisting.constant";
import { ClinicListingServices } from "./cliniclisting.service";
import { ClinicListCreateDto } from "./dto/cliniclisting.update.dto";
import { PostQueryCreateDto } from "./dto/cliniclisting.create.dto";




@Controller("/api/clinic-listing")
export class ClinicListingController{
    constructor(@Inject(CLINIC_LISTING_CONSTANT) private readonly clincilistingService:ClinicListingServices){}


    
    @Post('get-clinic-list')
    @Version('1')
    async getClinicListing(@Body() dto:ClinicListCreateDto) {

         console.log("dto",dto);
         
        return await this.clincilistingService.getClinicList(dto);
    }


    @Get('get-clinic-details/:id')
    @Version("1")
    async getClinicDetails(@Param("id") id:string){

        return await this.clincilistingService.getClinicDetails(id);
    }

    @Get('get-clinic-review/:id')
    @Version("1")
    async getGoogleReviews(@Param("id") id:string){

        return await this.clincilistingService.getGoogleReviews(id);
    }


    @Post("raise-post-query")
    @Version("1")
    async raiseQuery(@Body() dto:PostQueryCreateDto){

        console.log(dto);
        
        return await this.clincilistingService.postQuery(dto);
    }





    















}
