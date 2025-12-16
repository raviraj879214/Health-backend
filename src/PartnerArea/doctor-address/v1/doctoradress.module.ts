import { Module } from "@nestjs/common";
import { ClinicDoctorAddressController } from "./doctoradress.controller";
import { DOCTOR_ADDRESS_CONSTANT_SERVICE } from "../constant/doctoradress.constant";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/PartnerArea/AuthGuard/jwt-auth.guard";
import { DoctorAddressServices } from "./doctoradress.service";
import { HttpModule } from "@nestjs/axios";






@Module({
    imports: [HttpModule],
    controllers :[ClinicDoctorAddressController],
     providers :[
           {
               provide : DOCTOR_ADDRESS_CONSTANT_SERVICE,
               useClass : DoctorAddressServices
           },
           PrismaService,
           JwtAuthGuard
       ],
       exports :[DOCTOR_ADDRESS_CONSTANT_SERVICE]
})

export class ClinicDoctorAddressModule{}