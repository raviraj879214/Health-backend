import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    // ✅ Must include apiVersion
   this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-10-29.clover",
    });


    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('⚠️ STRIPE_SECRET_KEY is not defined in environment');
    }
  }

  async createCheckoutSession(
    amount: number,
    metadata: Record<string, any>,
    successUrl: string,
    cancelUrl: string
  ) {

    console.log("metadata",metadata);



    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: metadata.packagename || 'Package',
            },
          },
          quantity: 1,
        },
      ],

      metadata,
      payment_intent_data: {
        metadata, // ✅ store metadata on PaymentIntent (visible in Dashboard)
      },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });


    return session;
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId, { 
      expand: ['payment_intent'] 
    });
  }
}
