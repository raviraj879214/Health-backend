import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { PrismaService } from "src/prisma/prisma.service";
import { PATIENT_QUERIES } from "../constant/patientqueries.constant";
import { PatientQueriesController } from "./patientqueries.controller";
import { PatientQueriesServices } from "./patientqueries.service";
import { Module } from "@nestjs/common";




@Module({
     controllers:[PatientQueriesController],
     providers:[
        {
            provide : PATIENT_QUERIES,
            useClass : PatientQueriesServices
        },
        RolesGuard, JwtService , PrismaService
     ],
     exports: [PATIENT_QUERIES],
})
export class ManagePatietnQueriesModule{}