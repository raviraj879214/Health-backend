import { Module } from "@nestjs/common";
import { ManageDoctorController } from "./managedoctor.controller";
import { MANAGE_DOCTOR_CONSTANT } from "../constant/managedoctor.constant";
import { ManageDoctorServices } from "./managedoctor.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";




@Module({
     controllers:[ManageDoctorController],
     providers:[
        {
            provide : MANAGE_DOCTOR_CONSTANT,
            useClass : ManageDoctorServices
        },
        RolesGuard, JwtService , PrismaService
     ],
     exports: [MANAGE_DOCTOR_CONSTANT],
})
export class ManageDoctorModule{}