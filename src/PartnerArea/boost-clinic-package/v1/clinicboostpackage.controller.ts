import { Body, Controller, Get, Inject, Post, Request, UseGuards, Version } from "@nestjs/common";
import { CLINIC_BOOST_PACKAGES_CONSTANT } from "../constant/clinicboostpackage.constant";
import { ClinicBoostPackagesListingsServices } from "./clinicboostpackage.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";








@Controller("/api/manage-clinic-boost-package")
export class ManageClinicBoostPackageController{
    constructor(@Inject(CLINIC_BOOST_PACKAGES_CONSTANT) private readonly manageClinicListingBoostServices:ClinicBoostPackagesListingsServices){}



        @UseGuards(JwtAuthGuard)
        @Get("get-boost-packages")
        @Version("1")
        async getBoostPackages(){
            console.log("testestse");
            return this.manageClinicListingBoostServices.getBoostPackages();
        }


        @UseGuards(JwtAuthGuard)
        @Get("/get-clinic-listing")
        @Version("1")
        async getClinicPackages(@Request() req){
    
            
            console.log("req.user.id",req.user.id);
            return this.manageClinicListingBoostServices.getClinicListing(req.user.id);

        }




    @UseGuards(JwtAuthGuard)
    @Post("insert-clinic-listing")
    @Version("1")
    async insertClinicPackage(@Body("sessionid") sessionid: string) {

        const sessionDetails = await this.manageClinicListingBoostServices.insertClinicBoost(sessionid);

        return sessionDetails;
    }



    @UseGuards(JwtAuthGuard)
    @Get("get-current-clinic-listing")
    @Version("1")
    async getCurrentClinicListing(@Request() req){
         console.log("req.user.id",req.user.id);

         return this.manageClinicListingBoostServices.getCurrentClinicPackages(req.user.id);
    }






}