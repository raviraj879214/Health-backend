import { Module } from "@nestjs/common";
import { CLINIC_LISTING_CONSTANT } from "../constant/cliniclisting.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ClinicListingController } from "./cliniclisting.controller";
import { ClinicListingServices } from "./cliniclisting.service";






@Module({
    controllers :[ClinicListingController],
    providers:[
            {
                provide : CLINIC_LISTING_CONSTANT,
                useClass : ClinicListingServices
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[CLINIC_LISTING_CONSTANT]
})

export class ManageClinicListingModule{}




