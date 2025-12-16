import { Module } from "@nestjs/common";
import { ManagePackageSpecialityController } from "./packagestepthree.controller";
import { PACKAGE_STEP_THREE_CONSTANT } from "../constant/packagestepthree.constatnt";
import { ManagePackageSpecialtyServices } from "./packagestepthree.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";




@Module({
    controllers :[ManagePackageSpecialityController],
    providers:[
            {
                provide : PACKAGE_STEP_THREE_CONSTANT,
                useClass : ManagePackageSpecialtyServices
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[PACKAGE_STEP_THREE_CONSTANT]
})



export class ManagePackageSpecialityModule{}