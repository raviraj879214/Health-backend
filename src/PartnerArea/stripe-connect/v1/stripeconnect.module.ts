import { PrismaService } from "src/prisma/prisma.service";
import { STRIPECONNECTCONSTANT } from "../constant/stripeconnect.constant";
import { StripeConnectController } from "./stripeconnect.controller";
import { StripeConnectService } from "./stripeconnect.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { Module } from "@nestjs/common";




@Module({
    controllers :[StripeConnectController],
    providers:[
            {
                provide : STRIPECONNECTCONSTANT,
                useClass : StripeConnectService
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[STRIPECONNECTCONSTANT]
})
export class StripeConnectModule{}