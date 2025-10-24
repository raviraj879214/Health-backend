import Stripe from "stripe";




export interface IStripeSubscriptionService{

     createCustomer(email: string): Promise<Stripe.Customer>;
     createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription>;
     handleWebhook(event: Stripe.Event): Promise<void>;
    



}