import { Body, Controller, Get, Inject, Param, Post, Req, Request, UseGuards, Version } from "@nestjs/common";
import { BOOST_PACKAGES_CONSTANT } from "../constant/boostpackages.constant";
import { BoostPackagesServices } from "./boostpackages.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import Stripe from "stripe";
import { PaymentService } from "src/FrontEndModules/payments/payment.service";




@Controller("/api/boost-packages")
export class BoostPackagesController{
    public stripe: Stripe;
    constructor(@Inject(BOOST_PACKAGES_CONSTANT)private readonly boostPackagesServices:BoostPackagesServices){}



    @UseGuards(JwtAuthGuard)
    @Get("/get-boost-packages")
    @Version("1")
    async getBoostPackages(){
        
        return this.boostPackagesServices.getBoostPackages();
    }

    @UseGuards(JwtAuthGuard)
    @Get("/get-clinic-packages")
    @Version("1")
    async getClinicPackages(@Request() req){

        
        console.log("req.user.id",req.user.id);
        return this.boostPackagesServices.getClinicPackage(req.user.id);
    }


    @UseGuards(JwtAuthGuard)
    @Post("/insert-clinic-package")
    @Version("1")
    async insertClinicPackage(@Body("sessionid") sessionid: string) {

        const sessionDetails = await this.boostPackagesServices.insertClinicBoost(sessionid);
        
        return sessionDetails;
    }


    @UseGuards(JwtAuthGuard)
    @Get("/get-current-clinic-package")
    @Version("1")
    async getCurrentClinicPackages(@Request() req){
         console.log("req.user.id",req.user.id);

         return this.boostPackagesServices.getCurrentClinicPackages(req.user.id);
    }



    
    








}