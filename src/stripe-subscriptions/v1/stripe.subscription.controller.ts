import { Controller, Inject, Post, Req, Res , Headers, Version } from "@nestjs/common";
import { StripeSubscriptionService } from "./stripe.subscription.service";
import Stripe from "stripe";
import { STRIPE_SUBSCRIPTION_SERVICE_V1 } from "../constant/stripe.subscriptions.constant";








@Controller("/api/stripe-subscriptions")
export class StripeSubscriptionController{

     constructor(@Inject(STRIPE_SUBSCRIPTION_SERVICE_V1)private readonly stripeService  : StripeSubscriptionService)
        {
        
        }



        

         @Post()
          @Version("1")
            async handle(@Req() req, @Res() res, @Headers('stripe-signature') signature: string) {
                const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
                let event: Stripe.Event;

                try {
                event = this.stripeService['stripe'].webhooks.constructEvent(
                    req.rawBody,
                    signature,
                    webhookSecret
                );
                 console.log("stripe triggered",event);

                await this.stripeService.handleWebhook(event);
                res.status(200).send('OK');
                } catch (err) {
                res.status(400).send(`Webhook Error: ${err.message}`);
                }
            }

            

}