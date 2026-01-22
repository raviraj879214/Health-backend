import { Body, Controller, Get, Inject, Param, Post, UseGuards, Version } from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guards";

import { ManagePackageServices } from "./managepackage.service";
import { MANAGEPACKAGECONSTANT } from "../constant/managepackage.constant";
import { ModuleAccess } from "src/common/decorators/module-access.decorator";
import { SendMessageCreateDto } from "./dto/managepackage.create.dto";







@Controller("/api/manage-packages")
@UseGuards(RolesGuard)
export class ManagePackageController{

    constructor(@Inject(MANAGEPACKAGECONSTANT)private readonly manageClinicService:ManagePackageServices){}



        @Get("get-specialty/:packageid")
        @Version("1")
        @ModuleAccess("Manage Package")
        async getSpecialty(@Param("packageid") packageid: string) {

            return await this.manageClinicService.getSpecialty(packageid);
        }


        @Get("get-package-specialty/:packageid")
        @Version("1")
        @ModuleAccess("Manage Package")
        async getClinicSpecialty(@Param("packageid") packageid:string){

            return await this.manageClinicService.getPackageSpecialty(packageid);
        }



            @Get("accept-package-specialty/:id/:packageid")
             @Version("1")
             @ModuleAccess("Manage Package")
             async acceptClinicSpecialty(@Param("id") id:string,@Param("packageid") packageid:string){
        
                return await this.manageClinicService.acceptSpecailty(id,packageid);
        
             }
        
             @Get("reject-package-specialty/:id/:packageid")
             @Version("1")
             @ModuleAccess("Manage Package")
             async rejectClinicSpecialty(@Param("id") id:string,@Param("packageid") packageid:string){
        
                return await this.manageClinicService.rejectSpecailty(id,packageid);
             }
        
        
        
             @Post("assign-package-specialty")
             @Version("1")
             @ModuleAccess("Manage Package")
             async assignClinicSpecialty(@Body("assignid") assignid:string,@Body("packageid") packageid:string){
        
                return await this.manageClinicService.assignSpecialty(assignid,packageid);
             }
        
        
             @Post("unassign-package-specialty")
             @Version("1")
             @ModuleAccess("Manage Package")
             async unassignClinicSpecialty(@Body("unassignid") unassignid:string,@Body("packageid") packageid:string){
        
                return await this.manageClinicService.unassignSpecialty(unassignid,packageid);
             }




             
     @Get("get-sub-specialty/:packageid")
     @Version("1")
     @ModuleAccess("Manage Package")
     async getSubSpecialty(@Param("packageid") packageid:string){

        return await this.manageClinicService.getSubSpecialty(packageid);
     }

     @Get("get-package-sub-specialty/:packageid")
     @Version("1")
     @ModuleAccess("Manage Package")
     async getClinicSubSpecialty(@Param("packageid") packageid:string){

        return await this.manageClinicService.getPackageSubSpecialty(packageid);
     }


     @Get("accept-package-sub-specialty/:id/:packageid")
     @Version("1")
     @ModuleAccess("Manage Package")
     async acceptClinicSubSpecialty(@Param("id") id:string,@Param("packageid") packageid:string){

        return await this.manageClinicService.acceptSubSpecailty(id,packageid);

     }

     @Get("reject-package-sub-specialty/:id/:packageid")
     @Version("1")
    @ModuleAccess("Manage Package")
     async rejectClinicSubSpecialty(@Param("id") id:string,@Param("packageid") packageid:string){

        return await this.manageClinicService.rejectSubSpecailty(id,packageid);
     }



     @Post("assign-package-sub-specialty")
     @Version("1")
    @ModuleAccess("Manage Package")
     async assignClinicSubSpecialty(@Body("assignid") assignid:string,@Body("packageid") packageid:string){

         console.log("assignid",assignid);
         console.log("packageid",packageid);
         
        return await this.manageClinicService.assignSubSpecialty(assignid,packageid);
     }


     @Post("unassign-package-sub-specialty")
     @Version("1")
     @ModuleAccess("Manage Package")
     async unassignClinicSubSpecialty(@Body("unassignid") unassignid:string,@Body("packageid") packageid:string){

        return await this.manageClinicService.unassignSubSpecialty(unassignid,packageid);
     }





       @Get("get-treatment/:packageid")
     @Version("1")
        @ModuleAccess("Manage Package")
     async getTreatments(@Param("packageid") packageid:string){

        return await this.manageClinicService.getTreatment(packageid);
     }

     @Get("get-package-treatment/:packageid")
     @Version("1")
        @ModuleAccess("Manage Package")
     async getClinicTreatments(@Param("packageid") packageid:string){

        return await this.manageClinicService.getPackageTreatment(packageid);
     }


     @Get("accept-package-treatment/:id/:packageid")
     @Version("1")
        @ModuleAccess("Manage Package")
     async acceptTreatment(@Param("id") id:string,@Param("packageid") packageid:string){

        return await this.manageClinicService.acceptTreatment(id,packageid);

     }

     @Get("reject-package-treatment/:id/:packageid")
     @Version("1")
     @ModuleAccess("Manage Package")
     async rejectTreatment(@Param("id") id:string,@Param("packageid") packageid:string){

        return await this.manageClinicService.rejectTreatment(id,packageid);
     }



     @Post("assign-package-treatment")
     @Version("1")
        @ModuleAccess("Manage Package")
     async assignTreatment(@Body("assignid") assignid:string,@Body("packageid") packageid:string){

         console.log("assignid",assignid);
         console.log("packageid",packageid);
         
        return await this.manageClinicService.assignTreatment(assignid,packageid);
     }


     @Post("unassign-package-treatment")
     @Version("1")
     @ModuleAccess("Manage Package")
     async unassignTreatment(@Body("unassignid") unassignid:string,@Body("packageid") packageid:string){

        return await this.manageClinicService.unassignTreatment(unassignid,packageid);
     }



     

       @Get("get-procedure/:packageid")
     @Version("1")
        @ModuleAccess("Manage Package")
     async getProcedure(@Param("packageid") packageid:string){

        return await this.manageClinicService.getProcedure(packageid);
     }

     @Get("get-package-procedure/:packageid")
     @Version("1")
        @ModuleAccess("Manage Package")
     async getClinicProcedure(@Param("packageid") packageid:string){

        return await this.manageClinicService.getPackageProcedure(packageid);
     }


     @Get("accept-package-procedure/:id/:packageid")
     @Version("1")
        @ModuleAccess("Manage Package")
     async acceptProcedure(@Param("id") id:string,@Param("packageid") packageid:string){

        return await this.manageClinicService.acceptProcedure(id,packageid);

     }

     @Get("reject-package-procedure/:id/:packageid")
     @Version("1")
     @ModuleAccess("Manage Package")
     async rejectProcedure(@Param("id") id:string,@Param("packageid") packageid:string){

        return await this.manageClinicService.rejectProcedure(id,packageid);
     }



     @Post("assign-package-procedure")
     @Version("1")
        @ModuleAccess("Manage Package")
     async assignProcedure(@Body("assignid") assignid:string,@Body("packageid") packageid:string){

         console.log("assignid",assignid);
         console.log("packageid",packageid);
         
        return await this.manageClinicService.assignProcedure(assignid,packageid);
     }


     @Post("unassign-package-procedure")
     @Version("1")
     @ModuleAccess("Manage Package")
     async unassignProcedure(@Body("unassignid") unassignid:string,@Body("packageid") packageid:string){

        return await this.manageClinicService.unassignProcedure(unassignid,packageid);
     }
     


      @Post("/make-an-action")
      @Version("1")
      @ModuleAccess("Manage Package")
      async makeAnAction(@Body() dto:SendMessageCreateDto){
         
         return await this.manageClinicService.sendMessageToClinic(dto);
      }






}