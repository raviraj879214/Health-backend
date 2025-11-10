

import { Body, Controller, Post, Version } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('/api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-session')
  @Version("1")
  async createSession(@Body() body: { amount: number; metadata?: Record<string, any> }) {
    const { amount, metadata = {} } = body;
    const successUrl = `${process.env.Front_End_APP_URL}`;
    const cancelUrl = `${process.env.Front_End_APP_URL}`;

    const session = await this.paymentService.createCheckoutSession(amount, metadata, successUrl, cancelUrl);
    return { url: session.url, id: session.id };
  }
  
}
