// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  providers: [NotificationsGateway, NotificationsService, PrismaService],
  controllers: [NotificationsController],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
