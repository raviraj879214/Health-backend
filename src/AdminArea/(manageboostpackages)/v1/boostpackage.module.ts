import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";
import { BoostPackageController } from "./boostpackage.controller";
import { BOOSTPACKAGECONSTANT } from "../constant/boostpackage.constant";
import { BoostPackageServices } from "./boostpackage.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { Module } from "@nestjs/common";



@Module({
    imports : [ActivityLogModule],
    controllers: [BoostPackageController],
      providers: [
        {
          provide: BOOSTPACKAGECONSTANT,
          useClass: BoostPackageServices,
        },
        RolesGuard, JwtService , PrismaService
      ],
      
      
      exports: [BOOSTPACKAGECONSTANT],
    
})

export class BoostPackageModule {}