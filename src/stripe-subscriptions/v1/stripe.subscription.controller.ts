import { Controller, Post, Req, Res, Headers, Version, Get, Inject } from '@nestjs/common';
import type  { Request, Response } from 'express';
import { StripeSubscriptionService } from './stripe.subscription.service';
import Stripe from 'stripe';
import { STRIPE_SUBSCRIPTION_SERVICE_V1 } from '../constant/stripe.subscriptions.constant';


@Controller('/api/stripe-subscriptions')
export class StripeSubscriptionController {
  constructor(
    @Inject(STRIPE_SUBSCRIPTION_SERVICE_V1)
    private readonly stripeService: StripeSubscriptionService,
  ) {}

  @Get()
  @Version('1')
  async handles() {
    return {
      status: 200,
      message: 'ok',
    };
  }

  @Post()
  @Version('1')
  async handle(@Req() req: Request,@Res() res: Response,@Headers('stripe-signature') signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      // Use rawBody from Express (bodyParser.raw in main.ts)
      event = this.stripeService.stripe.webhooks.constructEvent(
        req.body, // rawBody from bodyParser.raw
        signature,
        webhookSecret,
      );

      console.log('Stripe webhook triggered:', event.type);

      await this.stripeService.handleWebhook(event);

      res.status(200).send('OK');
    } catch (err: any) {
      console.error('Stripe webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
