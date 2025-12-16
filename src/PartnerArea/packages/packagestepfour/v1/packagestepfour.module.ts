import { Module } from "@nestjs/common";
import { ManagePackageTreatmentController } from "./packagestepfour.controller";
import { PACKAGE_STEP_FOUR_CONSTANT } from "../constant/packagestepfour.constant";
import { ManagePackageTreatmentServices } from "./packagestepfour.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";









@Module({
    controllers :[ManagePackageTreatmentController],
    providers:[
            {
                provide : PACKAGE_STEP_FOUR_CONSTANT,
                useClass : ManagePackageTreatmentServices
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[PACKAGE_STEP_FOUR_CONSTANT]
})

export class ManagePackageTreatmentModule{}