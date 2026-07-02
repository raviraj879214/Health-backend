import { Body, Controller, Get, Inject, Param, Post, Put, Query, Version } from "@nestjs/common";
import { HOMEPAGE_BANNER_CONSTANT } from "../constant/banner.constant";
import { HomePageBannerServices } from "./banner.service";
import { BannerCreateClinicDto } from "./dto/banner.create.dto";
import { SearchClinicDto } from "./dto/SearchClinicDto .dto";
import { get } from "axios";
import { title } from "process";







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


      @Get("get-faqs")
      @Version("1")
      async getFaqs(){
         
         return await this.homepageBannerService.getFaqs();
      }




      @Get("clinic-boost-cron-job")
      @Version("1")
      async clinicBoostCronjob(){
         return await this.homepageBannerService.clinicboostcronjob();
      }




       @Put("update-service-payment-status")
         @Version("1")
         
         async updatePaymentServiceStatus(@Body() dto:{id:string}){
   
            return await this.homepageBannerService.updatePaymentAdditionalServices(dto.id);
         }


         @Get("seo-page-content/:slug")
         async seoPagesContent(@Param("slug") slug:string){

            return await this.homepageBannerService.getSeoPageContent(slug);
         }


         @Get("get-seo-slug")
         async seoPagesSlug(){
               
            return await this.homepageBannerService.getSeoPageSlug();
         }

         @Get("get-redirects")
         async getredirects(){

            return await this.homepageBannerService.getRedirects();
         }


         @Get("get-blogs")
         @Version("1")
         async getBlogs() {
            return await this.homepageBannerService.getBlogs();
         }

         @Get("get-blogs-details/:slug")
         @Version("1")
         async getBlogsDetails(@Param("slug") slug:string) {
            return await this.homepageBannerService.getBlogDetails(slug);
         }


   @Post("search-clinic")
   @Version("1")
   async searchClinic(@Body() body: SearchClinicDto) {

      const { specialization, treatments } = body;
      return await this.homepageBannerService.getClinicBySearch(body!);
   }


   @Get("get-treatment-for-packages")
   @Version("1")
   async getTreatmentForPackages(){

      console.log("dfdf");
      return await this.homepageBannerService.getTreatmentsForAllPackages();
   }



   @Get("packages-by-treatment")
   async getPackagesBytreatments(@Query("treatmentId") treatmentId: string, @Query("page") page = 1, @Query("limit") limit = 10,) {

      return await this.homepageBannerService.getPackagesByTreatments(treatmentId, Number(page), Number(limit),);
   }


   @Get("get-cms/:id")
   async getCmsContent(@Param("id") id:string){
      console.log("id",id);
      return await this.homepageBannerService.getCms(id);
   }




}