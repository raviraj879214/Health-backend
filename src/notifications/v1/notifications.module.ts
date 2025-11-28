import { PrismaService } from "src/prisma/prisma.service";
import { NotificationsController } from "./notifications.controller";
import { NotificationsGateway } from "./notifications.gateway";
import { NotificationsService } from "./notifications.service";
import { RolesGuard } from "src/common/guards/roles.guards";
import { JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsGateway,
    NotificationsService,
    PrismaService,
    RolesGuard,
    JwtService
  ],
  exports: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
