import { Module } from "@nestjs/common";
import { ManagePackageProcedureController } from "./packagestepfive.controller";
import { PACKAGE_STEP_FIVE_CONSTANT } from "../constant/packagestepfive.constant";
import { ManagePackageProcedureServices } from "./packagestepfive.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";






@Module({
    imports:[UniversalNotificationnModule],
    controllers :[ManagePackageProcedureController],
    providers:[
            {
                provide : PACKAGE_STEP_FIVE_CONSTANT,
                useClass : ManagePackageProcedureServices
            },
            PrismaService,
            JwtAuthGuard,
            EmailService
    ],
    exports :[PACKAGE_STEP_FIVE_CONSTANT]
})

export class ManagePackageProcedureModule{}