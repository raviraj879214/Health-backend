import { Module } from "@nestjs/common";
import { ManageDoctorController } from "./managedoctor.controller";
import { MANAGE_DOCTOR_CONSTANT } from "../constant/managedoctor.constant";
import { ManageDoctorServices } from "./managedoctor.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";




@Module({
    imports:[UniversalNotificationnModule],
     controllers:[ManageDoctorController],
     providers:[
        {
            provide : MANAGE_DOCTOR_CONSTANT,
            useClass : ManageDoctorServices
        },
        RolesGuard, JwtService , PrismaService,
        EmailService
     ],
     exports: [MANAGE_DOCTOR_CONSTANT],
})
export class ManageDoctorModule{}