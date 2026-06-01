import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { PrismaService } from "src/prisma/prisma.service";
import { CLINICDETAILSCONSTANT } from "../constant/clinicdetails.constant";
import { ClinicDetailServices } from "./clinicdetails.service";
import { ClinicDetailsController } from "./clinicdetails.controller";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";
import { Module } from "@nestjs/common";



@Module({
    imports : [ActivityLogModule],
    controllers: [ClinicDetailsController],
      providers: [
        {
          provide: CLINICDETAILSCONSTANT,
          useClass: ClinicDetailServices,
        },
        RolesGuard, JwtService , PrismaService
      ],
      
      
      exports: [CLINICDETAILSCONSTANT],
    
})

export class ClinicDetailSeoModule {}