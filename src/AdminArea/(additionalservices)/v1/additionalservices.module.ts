import { Module } from "@nestjs/common";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";
import { AdditonalServicesController } from "./additionalservices.controller";
import { ADDITIONALSERVICES } from "../constant/additionalservices.constant";
import { ADMINDASHBOARDCONSTANT } from "src/AdminArea/(dashboard)/constant/admin.constant";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AdditionalServices } from "./additionalservices.services";





@Module({
    imports : [ActivityLogModule],
    controllers: [AdditonalServicesController],
      providers: [
        {
          provide: ADDITIONALSERVICES,
          useClass: AdditionalServices,
        },
        RolesGuard, JwtService , PrismaService
      ],
      
      
      exports: [ADDITIONALSERVICES],
    
})


export class AdditionalServicesModule {}