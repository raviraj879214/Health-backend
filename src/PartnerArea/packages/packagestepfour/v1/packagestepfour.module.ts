import { Module } from "@nestjs/common";
import { ManagePackageTreatmentController } from "./packagestepfour.controller";
import { PACKAGE_STEP_FOUR_CONSTANT } from "../constant/packagestepfour.constant";
import { ManagePackageTreatmentServices } from "./packagestepfour.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";









@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManagePackageTreatmentController],
    providers:[
            {
                provide : PACKAGE_STEP_FOUR_CONSTANT,
                useClass : ManagePackageTreatmentServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService,
            UrlGeneratorService
    ],
    exports :[PACKAGE_STEP_FOUR_CONSTANT]
})

export class ManagePackageTreatmentModule{}