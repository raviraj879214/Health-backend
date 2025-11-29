import { Module } from "@nestjs/common";
import { ClinicDescriptionController } from "./clinicdescription.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { MANAGE_CLINIC_SERVICES_V1 } from "src/PartnerArea/Manage-Clinics/constant/manage.clinic.constant";
import { ClinicDescriptionService } from "./clinicdescription.service";





@Module({
    controllers :[ClinicDescriptionController],
    providers :[
        {
            provide : MANAGE_CLINIC_SERVICES_V1,
            useClass : ClinicDescriptionService
        },
        PrismaService,
        JwtAuthGuard
    ],
    exports :[MANAGE_CLINIC_SERVICES_V1]

})

export class ClinicDescriptionModule{}