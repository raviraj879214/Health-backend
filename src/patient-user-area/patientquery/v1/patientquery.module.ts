import { Module } from "@nestjs/common";
import { PatientQueryController } from "./patientquery.controller";
import { PATIENTQUERYCONSTANT } from "../constant/patinetquery.constant";
import { PatientQueryServices } from "./patientquery.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailService } from "src/EmailServices/email.service";







@Module({
     controllers:[PatientQueryController],
     providers:[
        {
            provide : PATIENTQUERYCONSTANT,
            useClass : PatientQueryServices
        },
        RolesGuard, JwtService , PrismaService,EmailService
     ],
     exports: [PATIENTQUERYCONSTANT],
})
export class PatietnQueryModule{}