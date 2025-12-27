import { Controller, Get, Inject, Param, UseGuards, Version } from "@nestjs/common";
import { MANAGE_DOCTOR_CONSTANT } from "../constant/managedoctor.constant";
import { ManageDoctorServices } from "./managedoctor.service";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { RolesGuard } from "src/common/guards/roles.guards";






@Controller("/api/manage-doctor")
@UseGuards(RolesGuard)
export class ManageDoctorController {
    constructor(@Inject(MANAGE_DOCTOR_CONSTANT) private readonly manageDoctorServices:ManageDoctorServices){}



         @Get("get-doctor-details/:id")
         @Version("1")
         @ModuleAccess("Manage Doctor Details")
         async getDoctorDetails(@Param("id") id:string){


            return await this.manageDoctorServices.getDoctorDetails(id);
         }

         @Get("get-doctor-surgery-images/:id")
         @Version("1")
         @ModuleAccess("Manage Doctor Details")
         async getDoctorSurgeryImages(@Param("id") id:string){


            return await this.manageDoctorServices.getDoctorSurgeryImages(id);
         }


          @Get("get-doctor-clinics-address/:id")
         @Version("1")
         @ModuleAccess("Manage Doctor Details")
         async getDoctorClinicAddress(@Param("id") id:string){


            return await this.manageDoctorServices.getDoctorsClinic(id);
         }










}