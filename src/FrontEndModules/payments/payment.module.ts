


import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';


@Module({
  providers: [PaymentService],
  controllers: [PaymentController, WebhookController],
})
export class PaymentModule {}
