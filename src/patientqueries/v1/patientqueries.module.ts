import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { PrismaService } from "src/prisma/prisma.service";
import { PATIENT_QUERIES } from "../constant/patientqueries.constant";
import { PatientQueriesController } from "./patientqueries.controller";
import { PatientQueriesServices } from "./patientqueries.service";
import { Module } from "@nestjs/common";
import { UniversalNotificationnModule } from "src/notification/GlobalNotification/businessnotificationmodule";
import { EmailService } from "src/EmailServices/email.service";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";




@Module({
     
     controllers:[PatientQueriesController],
     providers:[
        {
            provide : PATIENT_QUERIES,
            useClass : PatientQueriesServices
        },
        RolesGuard, JwtService , PrismaService,EmailService
     ],
     exports: [PATIENT_QUERIES],
      imports:[UniversalNotificationnModule,ActivityLogModule],
})
export class ManagePatietnQueriesModule{}