import { Module } from '@nestjs/common';
import { StripeSubscriptionService } from './stripe.subscription.service';
import { StripeSubscription } from './stripe.subscription.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  providers: [StripeSubscriptionService , PrismaService],
  controllers: [StripeSubscription],
  exports: [StripeSubscriptionService],
  
})


export class StripeSubScriptionModule {}
