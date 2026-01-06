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







}