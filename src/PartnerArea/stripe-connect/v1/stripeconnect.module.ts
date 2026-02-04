import { PrismaService } from "src/prisma/prisma.service";
import { STRIPECONNECTCONSTANT } from "../constant/stripeconnect.constant";
import { StripeConnectController } from "./stripeconnect.controller";
import { StripeConnectService } from "./stripeconnect.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { Module } from "@nestjs/common";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";




@Module({
    imports:[UniversalNotificationnModule],
    controllers :[StripeConnectController],
    providers:[
            {
                provide : STRIPECONNECTCONSTANT,
                useClass : StripeConnectService
            },
            PrismaService,
            JwtAuthGuard,
            EmailService
    ],
    exports :[STRIPECONNECTCONSTANT]
})
export class StripeConnectModule{}