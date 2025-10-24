import { Controller, Post, Req, Res, Headers, Version, Get, Inject } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeSubscriptionService } from './stripe.subscription.service';
import Stripe from 'stripe';
import { STRIPE_SUBSCRIPTION_SERVICE_V1 } from '../constant/stripe.subscriptions.constant';

@Controller('/api/webhook')
export class StripeSubscriptionController {
  constructor(
    @Inject(STRIPE_SUBSCRIPTION_SERVICE_V1)
    private readonly stripeService: StripeSubscriptionService,
  ) {}

  @Get()
  @Version('1')
  async healthCheck() {
    return {
      status: 200,
      message: 'Webhook endpoint is alive',
    };
  }

  @Post()
  @Version('1')
  async handle(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      if (signature && webhookSecret) {
        // Stripe CLI / real webhook: must use raw body as Buffer
        event = this.stripeService.stripe.webhooks.constructEvent(
          req.body, // make sure you apply raw body middleware in main.ts
          signature,
          webhookSecret,
        );
      } else {
        // Postman / testing without signature verification
        event = req.body as Stripe.Event;
      }

      console.log('Stripe webhook received:', event.type);

      // Pass event to your service to handle business logic
      await this.stripeService.handleWebhook(event);

      res.status(200).send('OK');
    } catch (err: any) {
      console.error('Stripe webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
