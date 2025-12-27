


import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  providers: [PaymentService ,PrismaService],
  controllers: [PaymentController, WebhookController]

  
})
export class PaymentModule {}
