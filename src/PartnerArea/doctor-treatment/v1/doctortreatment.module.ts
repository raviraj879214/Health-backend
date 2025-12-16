import { Module } from "@nestjs/common";
import { DoctorTreatmentController } from "./doctortreatment.controller";
import { DOCTOR_TREATMENT_CONST_SERVICE } from "../constant/doctortreatment.constant";
import { DoctorTreatmentService } from "./doctortreatment.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";






@Module({

    controllers : [DoctorTreatmentController],
    providers:[
        {
            provide : DOCTOR_TREATMENT_CONST_SERVICE,
            useClass : DoctorTreatmentService
        },
        PrismaService,
        JwtStrategy
    ],

    exports :[DOCTOR_TREATMENT_CONST_SERVICE]
})


export class DoctorTreatment{}
