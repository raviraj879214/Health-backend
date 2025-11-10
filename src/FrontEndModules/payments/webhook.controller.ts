import {
  Controller,
  Post,
  Req,
  Res,
  Version,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import Stripe from 'stripe';



@Controller('/api/payments')
export class WebhookController {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    });
  }



  @Post('webhook')
  @Version("1")
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig,
        webhookSecret,
      );
    } catch (err: any) {
      console.error('⚠️ Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Payment complete:', session.id, session.metadata);
        break;
      }
      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return res.json({ received: true });
  }
}
