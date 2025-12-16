import { Module } from "@nestjs/common";
import { ManagePackageProcedureController } from "./packagestepfive.controller";
import { PACKAGE_STEP_FIVE_CONSTANT } from "../constant/packagestepfive.constant";
import { ManagePackageProcedureServices } from "./packagestepfive.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";






@Module({
    controllers :[ManagePackageProcedureController],
    providers:[
            {
                provide : PACKAGE_STEP_FIVE_CONSTANT,
                useClass : ManagePackageProcedureServices
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[PACKAGE_STEP_FIVE_CONSTANT]
})

export class ManagePackageProcedureModule{}