import Stripe from 'stripe';

export interface IStripeSubscriptionService {

  createCustomer(email: string): Promise<Stripe.Customer>;


  createCheckoutSession(customerId: string, priceId: string): Promise<Stripe.Checkout.Session>;


  handleWebhook(event: Stripe.Event): Promise<void>;
}
