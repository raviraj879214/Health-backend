import { Body, Controller, Get, Inject, Post, UseGuards, Version } from "@nestjs/common";
import { STRIPECONNECTCONSTANT } from "../constant/stripeconnect.constant";
import { StripeConnectService } from "./stripeconnect.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";







@Controller("/api/manage-stripe-connect")
export class StripeConnectController{

    constructor(@Inject(STRIPECONNECTCONSTANT) private readonly stripeConnectServices:StripeConnectService){}



    // @UseGuards(JwtAuthGuard)
    @Post("/update-stripe-connect-onboard-account")
    @Version("1")
    async updateStripeConnectAccount(@Body() body:{
        id:string
    }){


        return await this.stripeConnectServices.updateStripeConnectAccount(body.id);

    }



    



}