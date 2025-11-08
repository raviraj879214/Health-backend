import { Body, Controller, Get, Inject, Param, Put, Query, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";
import { PATIENTS_ADMIN_SERVICE_V1 } from "../constant/patients.constant";
import { PatientService } from "./patients.services";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { PatientUpdateDto } from "./dto/patients.update.dto";




@Controller("/api/manage-patients")
@UseGuards(RolesGuard)
export class PatientController{

    constructor(@Inject(PATIENTS_ADMIN_SERVICE_V1) private readonly patientservies : PatientService){}



        @Get("/get-all")
        @Version("1")
        @ModuleAccess("Manage Patient")
        async getAllPateints(@Query('page') page: string,@Query('limit') limit: string,@Query("status") status :string ){
             const pageNumber = parseInt(page) || 1;
             const pageSize = parseInt(limit) || 10;
            return await this.patientservies.getPatientlist(pageNumber,pageSize,status);
        }



        @Get("/get-by-id/:uuid")
        @Version("1")
        @ModuleAccess("Manage Patient")
        async getPatientDetails(@Param('uuid') uuid : string )
        {
            return await this.patientservies.getPatientDetails(uuid);
        }

        @Put("/update-block")
         @Version("1")
        @ModuleAccess("Manage Patient")
        async updateBlock(@Body() dto : PatientUpdateDto){

            return await this.patientservies.updateBlockStatus(dto);
        }



        @Put("/update-unblock/:id")
         @Version("1")
        @ModuleAccess("Manage Patient")
        async updateUnBlock(@Param("id") id:number){

            return await this.patientservies.updateUnBlockStatus(id);

        }













}