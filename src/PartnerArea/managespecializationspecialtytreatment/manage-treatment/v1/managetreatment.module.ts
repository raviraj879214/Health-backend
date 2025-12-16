import { Module } from "@nestjs/common";
import { ManageClinicTreatmentController } from "./managetreatment.controller";
import { MANAGE_CLINIC_TREATMENT } from "../constant/managetreatment.constant";
import { ManageClinicTreatmentServices } from "./managetreatment.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";








@Module({
    controllers :[ManageClinicTreatmentController],
    providers:[
            {
                provide : MANAGE_CLINIC_TREATMENT,
                useClass : ManageClinicTreatmentServices
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[MANAGE_CLINIC_TREATMENT]
})

export class ManageClinicTreatmentModule{}