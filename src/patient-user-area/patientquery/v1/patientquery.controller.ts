import { Body, Controller, Get, Inject, Param, Post, Version } from "@nestjs/common";
import { PATIENTQUERYCONSTANT } from "../constant/patinetquery.constant";
import { PatientQueryServices } from "./patientquery.service";
import { PatientQueryEmailVerify } from "./dto/patientquery.create.dto";







@Controller("/api/patient-query")
export class PatientQueryController{
    constructor(@Inject(PATIENTQUERYCONSTANT) private readonly patietnQueryServices:PatientQueryServices){}



    @Get("Get-specialty")
    @Version("1")
    async getSpecialty(){
        return await this.patietnQueryServices.getSpecialties();
    }

    @Post("verify-patient-email")
    @Version("1")
    async verifyPatientEmail(@Body() dto:PatientQueryEmailVerify)
    {
        return await this.patietnQueryServices.sendEmailOtp(dto.email);
    }


    @Get("get-cordinator-details/:clinicid")
    @Version("1")
    async getCordinatorDetails(@Param("clinicid") clinicid:string){

        return await this.patietnQueryServices.getCordinatorDetails(clinicid);
    }





      @Post('send-otp-phone')
      @Version("1")
      async sendOtp(@Body('phone') phone: string) {
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (process.env.NODE_ENV === 'local') {
          otp = '000000';
        }
        console.log("otp",otp);
        console.log("phone",phone);
        const result = await this.patietnQueryServices.sendOtp(phone, otp);
        return result;
      }














}