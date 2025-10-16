import { PrismaService } from "src/prisma/prisma.service";
import { ActivityLogService } from "./activity-log.service";
import { Module } from "@nestjs/common";


@Module({
  providers: [ActivityLogService, PrismaService],
  exports: [ActivityLogService], // <-- important
})

export class ActivityLogModule {}
