import { Module } from "@nestjs/common";
import { PackageStepSixController } from "./packagestepsix.controller";
import { PACKAGE_STEP_SIX_CONSTANT } from "../constant/packagestepsix.constant";
import { PackageStepSixServices } from "./packagestepsix.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";





@Module({
    controllers:[PackageStepSixController],
     providers:[
            {
                provide : PACKAGE_STEP_SIX_CONSTANT,
                useClass : PackageStepSixServices 
            },
            PrismaService,
            JwtStrategy
        ],
        exports : [PACKAGE_STEP_SIX_CONSTANT]
})

export class PackageStepSixModule{}