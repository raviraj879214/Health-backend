import { Module } from "@nestjs/common";

import { DOCTOR_SPECIALTY_SERVICE_CONSTANT } from "../constant/doctorspecialty.constant";
import { DoctorSpecilatyService } from "./doctorspecialty.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";
import { DoctorSpecialtyController } from "./doctorspecialty.controller";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";







@Module({
    imports:[UniversalNotificationnModule],
    controllers : [DoctorSpecialtyController],
    providers:[
        {
            provide : DOCTOR_SPECIALTY_SERVICE_CONSTANT,
            useClass : DoctorSpecilatyService
        },
        PrismaService,
        JwtStrategy,
        EmailService
    ],
    exports :[DOCTOR_SPECIALTY_SERVICE_CONSTANT]
})


export class DoctorSpecialty{}
