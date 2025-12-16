import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import getRawBody from 'raw-body';

@Controller('/api/payments')
export class WebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-10-29.clover' });

  @Post('webhook') // do not use @Version()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      // Read the raw body (Buffer)
      const rawBody = await getRawBody(req, {
        length: req.headers['content-length'],
        limit: '2mb',
        encoding: 'utf-8',
      });

      console.log('Is buffer?', Buffer.isBuffer(rawBody)); // should be true

      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      const event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

      console.log('✅ Signature verified');
      console.log('📌 Event type:', event.type);
      console.log('📦 Event data:', event.data.object);

      // Handle checkout.session.completed
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session metadata:', session.metadata);
      }

      return res.status(200).json({ received: true });
    } catch (err: any) {
      console.error('❌ Signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
