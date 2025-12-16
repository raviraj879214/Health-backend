import { Module } from "@nestjs/common";
import { DoctorDescriptionController } from "./doctordescription.controller";
import { DOCTOR_DESCRIPTIONS_SERVICE_CONSTANT } from "../constant/doctordescription.constant";
import { DoctorDescriptionService } from "./doctordescription.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";





@Module({
    controllers:[DoctorDescriptionController],
    providers:[
        {
            provide : DOCTOR_DESCRIPTIONS_SERVICE_CONSTANT,
            useClass :DoctorDescriptionService
        },
        PrismaService,
        JwtStrategy
    ],
    exports:[DOCTOR_DESCRIPTIONS_SERVICE_CONSTANT]
})

export class DoctorDecription{}