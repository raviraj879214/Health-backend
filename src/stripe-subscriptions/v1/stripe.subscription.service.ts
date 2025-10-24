import { Injectable } from "@nestjs/common";
import { IStripeSubscriptionService } from "../interface/stripe.subscriptions.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";





@Injectable()
export class StripeSubscriptionService implements IStripeSubscriptionService{

     constructor(private readonly prisma:PrismaService)
    {

    }

    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: '2025-09-30.clover', });



     async createCustomer(email: string) {
        return await this.stripe.customers.create({ email });
    }

  async createSubscription(customerId: string, priceId: string) {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async handleWebhook(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Update DB subscription status
        break;
      case 'invoice.paid':
        // Payment successful
        break;
      case 'invoice.payment_failed':
        // Payment failed
        break;
    }
  }








}