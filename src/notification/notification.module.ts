import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [WebhookController],
  providers: [NotificationService, NotificationGateway , PrismaService],
  exports: [NotificationService],
})

export class NotificationModule {}
