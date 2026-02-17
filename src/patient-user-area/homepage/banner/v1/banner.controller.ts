import { Body, Controller, Get, Inject, Param, Post, Query, Version } from "@nestjs/common";
import { HOMEPAGE_BANNER_CONSTANT } from "../constant/banner.constant";
import { HomePageBannerServices } from "./banner.service";
import { BannerCreateClinicDto } from "./dto/banner.create.dto";







@Controller("/api/homepage-banner")
export class HomepageBannerController {
   constructor(@Inject(HOMEPAGE_BANNER_CONSTANT) private readonly homepageBannerService: HomePageBannerServices) { }



   @Get("get-specialization")
   @Version("1")
   async getSpecialization(@Query("limit") limit: number) {

      return await this.homepageBannerService.getSpecialization(limit);
   }

   @Get("get-specialty")
   @Version("1")
   async getSpecialty() {

      return await this.homepageBannerService.getSpecialty();
   }

   @Get("get-treatment")
   @Version("1")
   async getTreatment(@Query("isFeatured") isFeatured?:string) {
      const featured = isFeatured?.toLowerCase() === 'true';
      return await this.homepageBannerService.getTreatmetnt(isFeatured);
   }

   @Get("get-places")
   @Version("1")
   async getPlaces(@Query("isFeatured") isFeatured?:string) {
      
      return await this.homepageBannerService.getPlaces();
   }
   




   
   @Post('get-clinic-list')
   @Version('1')
   async getTopRatedClinicListing(@Body() dto: BannerCreateClinicDto) {
        

      return await this.homepageBannerService.getTopRatedClinicListing(dto);
   }

   @Post('get-clinic-list-popular')
   @Version('1')
   async getPopularClinicListing(@Body() dto: BannerCreateClinicDto) {
   console.log("dto");

      return await this.homepageBannerService.getPopularClinicListing(dto);
   }



   @Get("get-home-page-packages")
   @Version("1")
   async getHomePagePackages(){

      return await this.homepageBannerService.getPackages();
   }


    @Get("get-google-reviews/:placesid")
    @Version("1")
    async getGoogleReviews(@Param("placesid") placesid:string){


      return await this.homepageBannerService.getGoogleReviews(placesid);
    }





   
      @Get("get-google-places-details/:input")
      @Version("1")
      async getPlacesID(@Param("input") input:string){
         
         return await this.homepageBannerService.getGooglePlaces(input);
      }








}