import { Body, Controller, Get, Inject, Param, Post, Put, Version } from "@nestjs/common";
import { PARTNER_REGISTER_CONSTANT } from "../constant/partnerregister.constant";
import { PartnerRegisterServices } from "./partnerregister.services";
import { PartnerRegisterClinicDetails, partnerRegisterCreateDto } from "./dto/partnerregister.update.dto";







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


      @Get("/get-clinic-details/:uuid")
      @Version("1")
      async getClinicDetails(@Param("uuid") uuid:string){
        return await this.partnerRegister.getClinicDetails(uuid);
      }


      
      @Post("/insert-clinic-details")
      @Version("1")
      async insertClinicDetails(@Body() dto:PartnerRegisterClinicDetails){
        console.log("dto",dto);
        return await this.partnerRegister.insertClinicDetails(dto);
      }


      @Post("/insert-more-clinic-details")
      @Version("1")
      async insertMoreClinicDetails(@Body() dto:PartnerRegisterClinicDetails){
        console.log("dto",dto);
        return await this.partnerRegister.insertMoreClinicDetails(dto);
      }

      @Post("/accept-clinic-terms")
      @Version("1")
      async accceptTerms(@Body() dto:PartnerRegisterClinicDetails){
        console.log("dto",dto);
        return await this.partnerRegister.accepttermsCondition(dto);
      }



      

      @Get("/get-country-state")
      @Version("1")
      async getCountryCitys(){

        return await this.partnerRegister.getCountryCity();
      }


      @Post('send-otp-phone')
      @Version("1")
      async sendOtp(@Body('phone') phone: string) {
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (process.env.NODE_ENV === 'local') {
          otp = '0000';
        }
        console.log("otp",otp);
        console.log("phone",phone);
        const result = await this.partnerRegister.sendOtp(phone, otp);
        return result;
      }


      @Post('verify-otp-phone')
      @Version("1")
      async verifyPhoneOtp(@Body('cliniciduuid') cliniciduuid: string,@Body('phoneverify') phoneverify: string) {
       
        return await this.partnerRegister.verifyOtp(cliniciduuid,phoneverify);
      }


      @Get('get-terms/:name')
      @Version("1")
      async getTerms(@Param("name") name:string) {
       
        return await this.partnerRegister.getTermsCondition(name)
      }















      



      






}