import { Controller, Inject, Post, Req, Res , Headers } from "@nestjs/common";
import { StripeSubscriptionService } from "./stripe.subscription.service";
import Stripe from "stripe";








@Controller("/api/stripe-subscriptions")
export class StripeSubscription{

     constructor(@Inject(StripeSubscriptionService)private readonly stripeService  : StripeSubscriptionService)
        {
        
        }


         @Post()
            async handle(@Req() req, @Res() res, @Headers('stripe-signature') signature: string) {
                const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
                let event: Stripe.Event;

                try {
                event = this.stripeService['stripe'].webhooks.constructEvent(
                    req.rawBody,
                    signature,
                    webhookSecret
                );
                await this.stripeService.handleWebhook(event);
                res.status(200).send('OK');
                } catch (err) {
                res.status(400).send(`Webhook Error: ${err.message}`);
                }
            }

            

}