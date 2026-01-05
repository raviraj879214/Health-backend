import { Module } from "@nestjs/common";
import { CLINIC_LISTING_CONSTANT } from "../constant/cliniclisting.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ClinicListingController } from "./cliniclisting.controller";
import { ClinicListingServices } from "./cliniclisting.service";
import { ClinicListingBusiness } from "./business/cliniclisting.business.";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { NotificationService } from "src/notification/notification.service";
import { NotificationGateway } from "src/notification/notification.gateway";
import { HttpModule } from "@nestjs/axios";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";






@Module({
    controllers :[ClinicListingController],
    providers:[
            {
                provide : CLINIC_LISTING_CONSTANT,
                useClass : ClinicListingServices
            },
            PrismaService,
            JwtAuthGuard,
            ClinicListingBusiness,
            EmailService,
    ],
    imports:[UniversalNotificationnModule],
    exports :[CLINIC_LISTING_CONSTANT]
})

export class ManageClinicListingModule{}




