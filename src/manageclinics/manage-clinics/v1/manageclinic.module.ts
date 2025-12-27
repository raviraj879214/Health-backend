import { Module } from "@nestjs/common";
import { ManageClinicController } from "./manageclinic.controller";
import { ManageClinicServices } from "./manageclinic.service";
import { MANAGE_CLINIC_CONSTANT } from "../constant/manageclinic.constamt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";







@Module({
    controllers:[ManageClinicController],
    providers: [
       {
         provide: MANAGE_CLINIC_CONSTANT,
         useClass: ManageClinicServices,
       },
   
       RolesGuard, JwtService , PrismaService
     ],
     
     exports: [MANAGE_CLINIC_CONSTANT],
})
export class ManageClinicModule{}