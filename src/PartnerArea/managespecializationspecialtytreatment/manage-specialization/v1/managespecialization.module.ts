import { Module } from "@nestjs/common";
import { ManageClinicSpecializationController } from "./managespecialization.controller";
import { MANAGE_SPECIALIZATION_CONSTANT } from "../constant/managespecialization.constant";
import { ManageClinicSpecializationsServices } from "./managespecialization.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";



@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManageClinicSpecializationController],
    providers:[
            {
                provide : MANAGE_SPECIALIZATION_CONSTANT,
                useClass : ManageClinicSpecializationsServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService,UrlGeneratorService
    ],
    exports :[MANAGE_SPECIALIZATION_CONSTANT]
})

export class ManageClinicSpecializationModule{}