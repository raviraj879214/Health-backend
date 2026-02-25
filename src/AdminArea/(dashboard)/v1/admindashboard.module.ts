import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";
import { PrismaService } from "src/prisma/prisma.service";
import { ADMINDASHBOARDCONSTANT } from "../constant/admin.constant";
import { AdminDasboardServices } from "./admindashboard.service";
import { AdminDashboardController } from "./admindashboard.controller";
import { Module } from "@nestjs/common";









@Module({
    imports : [ActivityLogModule],
    controllers: [AdminDashboardController],
      providers: [
        {
          provide: ADMINDASHBOARDCONSTANT,
          useClass: AdminDasboardServices,
        },
        RolesGuard, JwtService , PrismaService
      ],
      
      
      exports: [ADMINDASHBOARDCONSTANT],
    
})



export class AdminDashboardModule {}