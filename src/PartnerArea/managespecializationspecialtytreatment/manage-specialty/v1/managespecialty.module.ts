import { Module } from "@nestjs/common";
import { ManageClinicSpecialityController } from "./managespecialty.controller";
import { MANAGE_SPECIALTY_CONSTANT } from "../constant/managespecialty.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ManageSpecialtyServices } from "./managespecialty.service";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";







@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManageClinicSpecialityController],
    providers:[
            {
                provide : MANAGE_SPECIALTY_CONSTANT,
                useClass : ManageSpecialtyServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService,
            UrlGeneratorService
    ],
    exports :[MANAGE_SPECIALTY_CONSTANT]
})

export class ManageClinicSpecialityModule{}