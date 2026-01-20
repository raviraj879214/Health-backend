import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
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







         
               //sepcialty
              @Get("get-specialty/:doctoruuid")
              @Version("1")
              @ModuleAccess("Manage Doctor Details")
              async getSpecialty(@Param("doctoruuid") doctoruuid:string){
         
                 return await this.manageDoctorServices.getSpecialty(doctoruuid);
              }
         
              @Get("get-doctor-specialty/:doctoruuid")
              @Version("1")
              @ModuleAccess("Manage Doctor Details")
              async getClinicSpecialty(@Param("doctoruuid") doctoruuid:string){
         
                 return await this.manageDoctorServices.getDoctorSpecialty(doctoruuid);
              }
         
         
              @Get("accept-doctor-specialty/:id/:doctoruuid")
              @Version("1")
              @ModuleAccess("Manage Doctor Details")
              async acceptClinicSpecialty(@Param("id") id:string,@Param("doctoruuid") doctoruuid:string){
         
                 return await this.manageDoctorServices.acceptSpecailty(id,doctoruuid);
         
              }
         
              @Get("reject-doctor-specialty/:id/:doctoruuid")
              @Version("1")
              @ModuleAccess("Manage Doctor Details")
              async rejectClinicSpecialty(@Param("id") id:string,@Param("doctoruuid") doctoruuid:string){
         
                 return await this.manageDoctorServices.rejectSpecailty(id,doctoruuid);
              }
         
         
         
              @Post("assign-doctor-specialty")
              @Version("1")
              @ModuleAccess("Manage Doctor Details")
              async assignClinicSpecialty(@Body("assignid") assignid:string,@Body("doctoruuid") doctoruuid:string){
         
                 return await this.manageDoctorServices.assignSpecialty(assignid,doctoruuid);
              }
         
         
              @Post("unassign-doctor-specialty")
              @Version("1")
              @ModuleAccess("Manage Doctor Details")
              async unassignClinicSpecialty(@Body("unassignid") unassignid:string,@Body("doctoruuid") doctoruuid:string){
         
                 return await this.manageDoctorServices.unassignSpecialty(unassignid,doctoruuid);
              }
              //end specialty
         
         



   //sub specialty

   @Get("get-sub-specialty/:doctoruuid")
   @Version("1")
   @ModuleAccess("Manage Doctor Details")
   async getSubSpecialty(@Param("doctoruuid") doctoruuid: string) {

      return await this.manageDoctorServices.getSubSpecialty(doctoruuid);
   }

   @Get("get-doctor-sub-specialty/:doctoruuid")
   @Version("1")
   @ModuleAccess("Manage Doctor Details")
   async getClinicSubSpecialty(@Param("doctoruuid") doctoruuid: string) {

      return await this.manageDoctorServices.getDoctorSubSpecialty(doctoruuid);
   }


   @Get("accept-doctor-sub-specialty/:id/:doctoruuid")
   @Version("1")
   @ModuleAccess("Manage Doctor Details")
   async acceptClinicSubSpecialty(@Param("id") id: string,@Param("doctoruuid") doctoruuid:string) {

      return await this.manageDoctorServices.acceptSubSpecailty(id,doctoruuid);

   }

   @Get("reject-doctor-sub-specialty/:id/:doctoruuid")
   @Version("1")
   @ModuleAccess("Manage Doctor Details")
   async rejectClinicSubSpecialty(@Param("id") id: string,@Param("doctoruuid") doctoruuid:string) {

      return await this.manageDoctorServices.rejectSubSpecailty(id,doctoruuid);
   }



   @Post("assign-doctor-sub-specialty")
   @Version("1")
   @ModuleAccess("Manage Doctor Details")
   async assignClinicSubSpecialty(@Body("assignid") assignid: string, @Body("doctoruuid") doctoruuid: string) {

      console.log("assignid", assignid);
      console.log("doctoruuid", doctoruuid);

      return await this.manageDoctorServices.assignSubSpecialty(assignid, doctoruuid);
   }


   @Post("unassign-doctor-sub-specialty")
   @Version("1")
   @ModuleAccess("Manage Doctor Details")
   async unassignClinicSubSpecialty(@Body("unassignid") unassignid: string, @Body("doctoruuid") doctoruuid: string) {

      return await this.manageDoctorServices.unassignSubSpecialty(unassignid, doctoruuid);
   }

   //end sub specialty 




        //treatments 
       @Get("get-treatment/:doctoruuid")
     @Version("1")
      @ModuleAccess("Manage Doctor Details")
     async getTreatments(@Param("doctoruuid") doctoruuid:string){

        return await this.manageDoctorServices.getTreatment(doctoruuid);
     }

     @Get("get-doctor-treatment/:doctoruuid")
     @Version("1")
      @ModuleAccess("Manage Doctor Details")
     async getClinicTreatments(@Param("doctoruuid") doctoruuid:string){

        return await this.manageDoctorServices.getDoctorTreatment(doctoruuid);
     }


     @Get("accept-doctor-treatment/:id/:doctoruuid")
     @Version("1")
     @ModuleAccess("Manage Doctor Details")
     async acceptTreatment(@Param("id") id:string, @Param("doctoruuid") doctoruuid: string){

        return await this.manageDoctorServices.acceptTreatment(id,doctoruuid);

     }

     @Get("reject-doctor-treatment/:id/:doctoruuid")
     @Version("1")
      @ModuleAccess("Manage Doctor Details")
     async rejectTreatment(@Param("id") id:string, @Param("doctoruuid") doctoruuid: string){

        return await this.manageDoctorServices.rejectTreatment(id,doctoruuid);
     }



     @Post("assign-doctor-treatment")
     @Version("1")
     @ModuleAccess("Manage Doctor Details")
     async assignTreatment(@Body("assignid") assignid:string,@Body("doctoruuid") doctoruuid:string){

         console.log("assignid",assignid);
         console.log("doctoruuid",doctoruuid);
         
        return await this.manageDoctorServices.assignTreatment(assignid,doctoruuid);
     }


     @Post("unassign-doctor-treatment")
     @Version("1")
     @ModuleAccess("Manage Doctor Details")
     async unassignTreatment(@Body("unassignid") unassignid:string,@Body("doctoruuid") doctoruuid:string){

        return await this.manageDoctorServices.unassignTreatment(unassignid,doctoruuid);
     }

     //end treatments
     
     @Post("update-doctor-status")
     @Version("1")
     @ModuleAccess("Manage Doctor Details")
     async updateDoctorStatus(@Body("status") status:string,@Body("doctoruuid") doctoruuid:string,@Body("reason") reason:string)
     {
        return await this.manageDoctorServices.doctorUpdateStatus(status,doctoruuid,reason);
     }






}