import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";
import { REPORTCONSTANT } from "../constant/report.constant";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { Module } from "@nestjs/common";




@Module({
    imports : [ActivityLogModule],
    controllers: [ReportController],
      providers: [
        {
          provide: REPORTCONSTANT,
          useClass: ReportService,
        },
        RolesGuard, JwtService , PrismaService
      ],
      exports: [REPORTCONSTANT],
})

export class ReportModule {}