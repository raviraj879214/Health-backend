import { Module } from "@nestjs/common";
import { ManageSpecialtyController } from "./managespecialties.controller";
import { MANAGESPECIALTIESCONSTANT } from "../constant/managespecialties.constant";
import { ManageSpecialtiesServices } from "./managespecialties.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";












@Module({
    imports : [ActivityLogModule],
    controllers: [ManageSpecialtyController],
      providers: [
        {
          provide: MANAGESPECIALTIESCONSTANT,
          useClass: ManageSpecialtiesServices,
        },
        RolesGuard, JwtService , PrismaService
      ],
      
      
      exports: [MANAGESPECIALTIESCONSTANT],
    
})



export class ManageSpecialtyModule {}