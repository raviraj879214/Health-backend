import { Module } from "@nestjs/common";
import { ManagePayoutController } from "./manageapyout.controller";
import { MANAGE_PAYOUT_CONSTATNT } from "../constant/manageapyout.constant";
import { ManagePayoutServices } from "./manageapyout.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";






@Module({
    imports:[UniversalNotificationnModule],
     controllers:[ManagePayoutController],
     providers:[
        {
            provide : MANAGE_PAYOUT_CONSTATNT,
            useClass : ManagePayoutServices
        },
        RolesGuard, JwtService , PrismaService ,EmailService
     ],
     exports: [MANAGE_PAYOUT_CONSTATNT],
})
export class ManagePayoutModule{}