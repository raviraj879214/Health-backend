import { Module } from "@nestjs/common";
import { BoostPackagesController } from "./boostpackages.controller";
import { BOOST_PACKAGES_CONSTANT } from "../constant/boostpackages.constant";
import { BoostPackagesServices } from "./boostpackages.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";






@Module({
        controllers : [BoostPackagesController],
        providers:[
            {
                provide : BOOST_PACKAGES_CONSTANT,
                useClass : BoostPackagesServices
            },
            PrismaService,
            JwtStrategy
        ],
        exports :[BOOST_PACKAGES_CONSTANT]
})

export class BoostPackagesModule{}