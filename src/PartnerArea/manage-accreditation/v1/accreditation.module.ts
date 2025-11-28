import { Module } from "@nestjs/common";
import { AccreditationController } from "./accreditation.controller";
import { ACCREDITATION_CONSTANT_SERVICE } from "../constant/accreditation.constant";
import { AccreditationService } from "./accreditation.services";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";






@Module({
    controllers :[AccreditationController],
    providers :[
        {
            provide : ACCREDITATION_CONSTANT_SERVICE,
            useClass : AccreditationService
        },
        PrismaService,
        JwtAuthGuard
    ],
    exports :[ACCREDITATION_CONSTANT_SERVICE]

})


export class Accreditations{}