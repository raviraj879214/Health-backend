import { Module } from "@nestjs/common";
import { EmailtemplateController } from "./emailtemplate.controller";
import { EmailTemplateServics } from "./emailtemplate.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";




@Module({

      imports : [ActivityLogModule],
      controllers: [EmailtemplateController],
      providers: [EmailTemplateServics, PrismaService , RolesGuard, JwtService],
})



export class EmailtemplateModule{}