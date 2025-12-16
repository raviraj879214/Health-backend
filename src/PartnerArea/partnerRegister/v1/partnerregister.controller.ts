import { Body, Controller, Get, Inject, Param, Post, Put, Version } from "@nestjs/common";
import { PARTNER_REGISTER_CONSTANT } from "../constant/partnerregister.constant";
import { PartnerRegisterServices } from "./partnerregister.services";
import { partnerRegisterCreateDto } from "./dto/partnerregister.update.dto";







@Controller("/api/partner-register")
export class PartnerRegisterController{

    constructor(@Inject(PARTNER_REGISTER_CONSTANT)private readonly partnerRegister:PartnerRegisterServices){}




    @Post("/validate-email")
    @Version("1")
    async validateemail(@Body("email") email:string){

        return await this.partnerRegister.validateEmailAndOtp(email);
    }


    @Post("/update-otp-service")
    @Version("1")
    async updateOtp(@Body() dto:partnerRegisterCreateDto){

        return await this.partnerRegister.updateOtpServices(dto);
    }


    @Get("/get-clinic-user-details/:uuid")
    @Version("1")
    async getClinicUserDetails(@Param("uuid") uuid:string){


        return await this.partnerRegister.getClinicUserDetail(uuid);
    }

    @Put("/insert-clinic-user-details")
    @Version("1")
    async insertClinicUser(@Body() dto:partnerRegisterCreateDto){

        return await this.partnerRegister.insertClinicUserDetails(dto);
    }












}