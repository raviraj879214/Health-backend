import { Module } from "@nestjs/common";
import { ManageClinicBoostPackageController } from "./clinicboostpackage.controller";
import { CLINIC_BOOST_PACKAGES_CONSTANT } from "../constant/clinicboostpackage.constant";
import { ClinicBoostPackagesListingsServices } from "./clinicboostpackage.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";







@Module({
        controllers : [ManageClinicBoostPackageController],
        providers:[
            {
                provide : CLINIC_BOOST_PACKAGES_CONSTANT,
                useClass : ClinicBoostPackagesListingsServices
            },
            PrismaService,
            JwtStrategy
        ],
        exports :[CLINIC_BOOST_PACKAGES_CONSTANT]
})

export class BoostClinicListingPackagesModule{}