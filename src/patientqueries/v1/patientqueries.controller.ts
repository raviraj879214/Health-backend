import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards, Version } from "@nestjs/common";
import { PATIENT_QUERIES } from "../constant/patientqueries.constant";
import { PatientQueriesServices } from "./patientqueries.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { PatientQueryCreateDto } from "./dto/patientqueries.create.dto";





@Controller("/api/patient-queries")
@UseGuards(RolesGuard)
export class PatientQueriesController{
    constructor(@Inject(PATIENT_QUERIES) private readonly patientQueriesService:PatientQueriesServices){}


        @Get("get-patient-queries")
        @Version("1")
        @ModuleAccess("Manage Patient Queries")
        async getPatientQuereis(@Query('page') page: string,@Query('limit') limit: string){
            const pageNumber = parseInt(page) || 0;
            const pageSize = parseInt(limit) || 0;
            return await this.patientQueriesService.getPateintQueries(pageNumber,pageSize);
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








        



}