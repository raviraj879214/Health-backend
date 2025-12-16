import { Module } from "@nestjs/common";
import { ManageClinicSpecialityController } from "./managespecialty.controller";
import { MANAGE_SPECIALTY_CONSTANT } from "../constant/managespecialty.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { ManageSpecialtyServices } from "./managespecialty.service";







@Module({
    controllers :[ManageClinicSpecialityController],
    providers:[
            {
                provide : MANAGE_SPECIALTY_CONSTANT,
                useClass : ManageSpecialtyServices
            },
            PrismaService,
            JwtAuthGuard
    ],
    exports :[MANAGE_SPECIALTY_CONSTANT]
})

export class ManageClinicSpecialityModule{}