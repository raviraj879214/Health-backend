import { Module } from "@nestjs/common";
import { ManagePackageSpecializationController } from "./packagesteptwo.controller";
import { ManagePackageSpecializationsServices } from "./packagesteptwo.service";
import { PACKAGE_TWO_CONSTATNT } from "../constant/packagesteptwo.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";





@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManagePackageSpecializationController],
    providers:[
            {
                provide : PACKAGE_TWO_CONSTATNT,
                useClass : ManagePackageSpecializationsServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService,
            UrlGeneratorService
    ],
    exports :[PACKAGE_TWO_CONSTATNT]
})

export class ManagePackageSpecializationModule{}