import { Module } from "@nestjs/common";
import { ManageClinicTreatmentController } from "./managetreatment.controller";
import { MANAGE_CLINIC_TREATMENT } from "../constant/managetreatment.constant";
import { ManageClinicTreatmentServices } from "./managetreatment.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";








@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManageClinicTreatmentController],
    providers:[
            {
                provide : MANAGE_CLINIC_TREATMENT,
                useClass : ManageClinicTreatmentServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService
    ],
    exports :[MANAGE_CLINIC_TREATMENT]
})

export class ManageClinicTreatmentModule{}