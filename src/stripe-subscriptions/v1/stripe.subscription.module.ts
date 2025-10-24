import { PrismaService } from "src/prisma/prisma.service";
import { STRIPE_SUBSCRIPTION_SERVICE_V1 } from "../constant/stripe.subscriptions.constant";
import { StripeSubscriptionController } from "./stripe.subscription.controller";
import { StripeSubscriptionService } from "./stripe.subscription.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [StripeSubscriptionController],
  providers: [
    {
      provide: STRIPE_SUBSCRIPTION_SERVICE_V1,
      useClass: StripeSubscriptionService,
    },
    PrismaService,
  ],
  exports: [STRIPE_SUBSCRIPTION_SERVICE_V1],
})
export class StripeSubScriptionModule {}
