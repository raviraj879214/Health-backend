import { Module } from "@nestjs/common";
import { ManagePackageDoctorController } from "./packagestepfive.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { PACKAGE_STEP_DOCTOR_CONSTANT } from "../constant/packagestepfive.constant";
import { ManagePackageDoctorServices } from "./packagestepfive.service";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";






@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManagePackageDoctorController],
    providers:[
            {
                provide : PACKAGE_STEP_DOCTOR_CONSTANT,
                useClass : ManagePackageDoctorServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService,
            UrlGeneratorService
    ],
    exports :[PACKAGE_STEP_DOCTOR_CONSTANT]
})

export class ManagePackageDoctorModule{}