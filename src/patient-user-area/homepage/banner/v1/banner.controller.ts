import { Controller, Get, Inject, Version } from "@nestjs/common";
import { HOMEPAGE_BANNER_CONSTANT } from "../constant/banner.constant";
import { HomePageBannerServices } from "./banner.service";







@Controller("/api/homepage-banner")
export class HomepageBannerController{
    constructor(@Inject(HOMEPAGE_BANNER_CONSTANT) private readonly homepageBannerService:HomePageBannerServices){}



    @Get("get-specialization")
    @Version("1")
    async getSpecialization(){

       return await this.homepageBannerService.getSpecialization();
    }

    @Get("get-specialty")
    @Version("1")
    async getSpecialty(){

       return await this.homepageBannerService.getSpecialty();
    }

    @Get("get-treatment")
    @Version("1")
    async getTreatment(){

       return await this.homepageBannerService.getTreatmetnt();
    }







}