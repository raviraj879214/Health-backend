import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards, Version } from "@nestjs/common";
import { PATIENT_QUERIES } from "../constant/patientqueries.constant";
import { PatientQueriesServices } from "./patientqueries.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { CreateOtherInformationDto, PatientQueryCreateDto } from "./dto/patientqueries.create.dto";
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { UpdateOtherInformationDto } from "./dto/patientqueries.update.dto";





@Controller("/api/patient-queries")
@UseGuards(RolesGuard)
export class PatientQueriesController{
    constructor(@Inject(PATIENT_QUERIES) private readonly patientQueriesService:PatientQueriesServices){}


        @Get("get-patient-queries")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async getPatientQuereis(@Query('page') page: string,@Query('limit') limit: string,@Req() request: AuthRequest){

            const userId = request.user?.sub;
           
            const pageNumber = parseInt(page) || 0;
            const pageSize = parseInt(limit) || 0;

            return await this.patientQueriesService.getPateintQueries(pageNumber,pageSize,Number(userId));
        }


        @Get("get-patient-queries-details/:id")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async getPatietnQueriesDetails(@Param('id') id: string){
            return await this.patientQueriesService.getPatientQueryDetails(id);
        }


        @Post("insert-final-deal-price")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async insertFinalDealPrice(@Body() dto:PatientQueryCreateDto){
            return await this.patientQueriesService.insertFinalDealPrice(dto);
        }


        @Get("get-clinic-list")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async getClinicDetails(){
            return await this.patientQueriesService.getClinicList();
        }

        @Post("assign-clinic-query")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async assignClinicQuery(@Body("clinicid") clinicid:string,@Body("queryid") queryid:string){
            return await this.patientQueriesService.assignClinicToPatientQuery(clinicid,queryid);
        } 


        @Get("get-packages-list/:id")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async getPackagesList(@Param("id") id:string){
            return await this.patientQueriesService.getPackagesList(id);
        }



        @Post("assign-package-query")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async assignPackageQuery(@Body("packageid") packageid:string,@Body("queryid") queryid:string){

            console.log("packageid",packageid);
            console.log("queryid",queryid);
            return await this.patientQueriesService.assignPackageToQuery(packageid,queryid);
        } 


        @Get("get-doctor-list/:id")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async getDoctorList(@Param("id") id:string){
            return await this.patientQueriesService.getDoctorList(id);
        }


        @Post("assign-doctor-query")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async assignDoctorQuery(@Body("doctorid") doctorid:string,@Body("queryid") queryid:string){

            console.log("doctorid",doctorid);
            console.log("queryid",queryid);
            return await this.patientQueriesService.assignDoctorToQuery(doctorid,queryid);
        } 




        @Put("assign-to-clinic-query")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async assignToClinicQuery(@Body("patientqueryid") patientqueryid:string,@Body("status") status:string){
            console.log(patientqueryid,status);
            return await this.patientQueriesService.assignQueryToClinic(patientqueryid,status);
        } 







        



}