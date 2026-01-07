import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards, Version } from "@nestjs/common";
import { MANAGE_CLINIC_CONSTANT } from "../constant/manageclinic.constamt";
import { ManageClinicServices } from "./manageclinic.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { SendMessageCreateDto } from "./dto/manageclinic.update.dto";








@Controller("/api/manage-clinic")
@UseGuards(RolesGuard)
export class ManageClinicController{
    constructor(@Inject(MANAGE_CLINIC_CONSTANT)private readonly manageClinicService:ManageClinicServices){}


     @Get("/get-clinic-listing")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicListing(@Query('page') page: string,@Query('limit') limit: string){
         const pageNumber = parseInt(page) || 0;
         const pageSize = parseInt(limit) || 0;
         
        return await this.manageClinicService.getClinicListing(pageNumber,pageSize);
     }


     @Get("get-clinic-details/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicDetails(@Param("clinicuuid") clinicuuid:string){


        return await this.manageClinicService.getClinicDetails(clinicuuid);
     }


     @Get("get-clinic-banner/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicBanner(@Param("clinicuuid") clinicuuid:string){


        return await this.manageClinicService.getClinicBannerImages(clinicuuid);
     }


     @Get("get-clinic-accreditation/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicAccreditaion(@Param("clinicuuid") clinicuuid:string){


        return await this.manageClinicService.getAccreditations(clinicuuid);
     }



     @Get("get-clinic-surgery-images/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicSurgeryImages(@Param("clinicuuid") clinicuuid:string){


        return await this.manageClinicService.getSurgeryImages(clinicuuid);
     }

     @Get("get-clinic-description/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicDescription(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getClinicDescription(clinicuuid);
     }






     @Get("get-specialty/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getSpecialty(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getSpecialty(clinicuuid);
     }

     @Get("get-clinic-specialty/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicSpecialty(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getClinicSpecialty(clinicuuid);
     }


     @Get("accept-clinic-specialty/:id")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async acceptClinicSpecialty(@Param("id") id:string){

        return await this.manageClinicService.acceptSpecailty(id);

     }

     @Get("reject-clinic-specialty/:id")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async rejectClinicSpecialty(@Param("id") id:string){

        return await this.manageClinicService.rejectSpecailty(id);
     }



     @Post("assign-clinic-specialty")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async assignClinicSpecialty(@Body("assignid") assignid:string,@Body("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.assignSpecialty(assignid,clinicuuid);
     }


     @Post("unassign-clinic-specialty")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async unassignClinicSpecialty(@Body("unassignid") unassignid:string,@Body("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.unassignSpecialty(unassignid,clinicuuid);
     }




     

     @Get("get-sub-specialty/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getSubSpecialty(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getSubSpecialty(clinicuuid);
     }

     @Get("get-clinic-sub-specialty/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicSubSpecialty(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getClinicSubSpecialty(clinicuuid);
     }


     @Get("accept-clinic-sub-specialty/:id")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async acceptClinicSubSpecialty(@Param("id") id:string){

        return await this.manageClinicService.acceptSubSpecailty(id);

     }

     @Get("reject-clinic-sub-specialty/:id")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async rejectClinicSubSpecialty(@Param("id") id:string){

        return await this.manageClinicService.rejectSubSpecailty(id);
     }



     @Post("assign-clinic-sub-specialty")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async assignClinicSubSpecialty(@Body("assignid") assignid:string,@Body("clinicuuid") clinicuuid:string){

         console.log("assignid",assignid);
         console.log("clinicuuid",clinicuuid);
         
        return await this.manageClinicService.assignSubSpecialty(assignid,clinicuuid);
     }


     @Post("unassign-clinic-sub-specialty")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async unassignClinicSubSpecialty(@Body("unassignid") unassignid:string,@Body("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.unassignSubSpecialty(unassignid,clinicuuid);
     }



     //treatments 
       @Get("get-treatment/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getTreatments(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getTreatment(clinicuuid);
     }

     @Get("get-clinic-treatment/:clinicuuid")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async getClinicTreatments(@Param("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.getClinicTreatment(clinicuuid);
     }


     @Get("accept-clinic-treatment/:id")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async acceptTreatment(@Param("id") id:string){

        return await this.manageClinicService.acceptTreatment(id);

     }

     @Get("reject-clinic-treatment/:id")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async rejectTreatment(@Param("id") id:string){

        return await this.manageClinicService.rejectTreatment(id);
     }



     @Post("assign-clinic-treatment")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async assignTreatment(@Body("assignid") assignid:string,@Body("clinicuuid") clinicuuid:string){

         console.log("assignid",assignid);
         console.log("clinicuuid",clinicuuid);
         
        return await this.manageClinicService.assignTreatment(assignid,clinicuuid);
     }


     @Post("unassign-clinic-treatment")
     @Version("1")
     @ModuleAccess("Manage Clinic")
     async unassignTreatment(@Body("unassignid") unassignid:string,@Body("clinicuuid") clinicuuid:string){

        return await this.manageClinicService.unassignTreatment(unassignid,clinicuuid);
     }

     //end treatments
     


     //packages
      @Get("get-clinic-packages/:id")
      @Version("1")
      @ModuleAccess("Manage Clinic")
      async getClinicPackages(@Param("id") id:string){

         return await this.manageClinicService.getClinicPackages(id);
      }


     //end


     //manage-packages

      @Get("/get-packages")
      @Version("1")
      @ModuleAccess("Manage Clinic")
      async getPackages(@Query('page') page: string,@Query('limit') limit: string){
            const pageNumber = parseInt(page) || 0;
            const pageSize = parseInt(limit) || 0;
            
         return await this.manageClinicService.getPackages(pageNumber,pageSize);
      }


      @Get("/get-packages-details/:id")
      @Version("1")
      @ModuleAccess("Manage Clinic")
      async getPackagesDetails(@Param('id') id: string){
           
         return await this.manageClinicService.getpackagesDetails(id);
      }
   
      //end


      //make an action
         @Post("/make-an-action")
         @Version("1")
         @ModuleAccess("Manage Clinic")
         async makeAnAction(@Body() dto:SendMessageCreateDto){
            
            return await this.manageClinicService.sendMessageToClinic(dto);
            
         }
         
      //end








}