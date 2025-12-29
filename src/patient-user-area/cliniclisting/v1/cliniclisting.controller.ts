import { Body, Controller, Get, Inject, Post, Query, Version } from "@nestjs/common";
import { CLINIC_LISTING_CONSTANT } from "../constant/cliniclisting.constant";
import { ClinicListingServices } from "./cliniclisting.service";
import { ClinicListCreateDto } from "./dto/cliniclisting.update.dto";




@Controller("/api/clinic-listing")
export class ClinicListingController{
    constructor(@Inject(CLINIC_LISTING_CONSTANT) private readonly clincilistingService:ClinicListingServices){}


    
    @Post('get-clinic-list')
    @Version('1')
    async getClinicListing(@Body() dto:ClinicListCreateDto) {

        
        return await this.clincilistingService.getClinicList(dto);
    }














}
