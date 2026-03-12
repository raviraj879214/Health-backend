import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";
import { FaqController } from "./faq.controller";
import { FAQCONSTANT } from "../constant/faq.constant";
import { FaqServices } from "./faq.services";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Module } from "@nestjs/common";






@Module({
    imports : [ActivityLogModule],
    controllers: [FaqController],
      providers: [
        {
          provide: FAQCONSTANT,
          useClass: FaqServices,
        },
        RolesGuard, JwtService , PrismaService
      ],
      
      
      exports: [FAQCONSTANT],
    
})

export class FaqModule {}