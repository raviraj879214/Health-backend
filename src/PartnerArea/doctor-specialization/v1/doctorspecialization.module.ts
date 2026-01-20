import { Module } from "@nestjs/common";
import { DoctorSpecializationController } from "./doctorspecialization.controller";
import { DOCTOR_SPECIALIZATION_SERVICE_CONSTANT } from "../constant/doctorspecialization.constant";
import { DoctorSpecializationService } from "./doctorspecialization.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtStrategy } from "src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";





@Module({
    imports:[UniversalNotificationnModule],
    controllers:[DoctorSpecializationController],
    providers:[
        {
            provide : DOCTOR_SPECIALIZATION_SERVICE_CONSTANT,
            useClass : DoctorSpecializationService
        },
        PrismaService,
        JwtStrategy,
        EmailService
    ],
  exports: [DOCTOR_SPECIALIZATION_SERVICE_CONSTANT],


})
export class DoctorSpecilizationModule{}