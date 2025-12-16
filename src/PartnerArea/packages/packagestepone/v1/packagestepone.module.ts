import { Module } from "@nestjs/common";
import { PackageStepOneController } from "./packagestepone.controller";
import { PACKAGE_STEP_ONE_CONSTANT } from "../constant/packagestepone.constant";
import { PackageStepOneServices } from "./packagestepone.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";





@Module({
    controllers : [PackageStepOneController],
    providers:[
        {
            provide : PACKAGE_STEP_ONE_CONSTANT,
            useClass : PackageStepOneServices
        },
        PrismaService,
        JwtStrategy
    ],
    exports : [PACKAGE_STEP_ONE_CONSTANT]
})

export class PackageStepOneModule{}