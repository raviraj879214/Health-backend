

import { Body, Controller, HttpException, Post, Version } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('/api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}


  @Post('create-session')
  @Version("1")
  async createSession(@Body() body: { amount: number; metadata?: Record<string, any> }) {
    const { amount, metadata = {} } = body;
    const successUrl = `${process.env.Front_End_APP_URL}/partner/boost-package`;
    const cancelUrl = `${process.env.Front_End_APP_URL}/partner/boost-package`;
    console.log("metadata",metadata);
    const session = await this.paymentService.createCheckoutSession(amount, metadata, successUrl, cancelUrl);
    return { url: session.url, id: session.id };
  }


  @Post('create-clinic-listing-session')
  @Version("1")
  async createClinicListingSession(@Body() body: { amount: number; metadata?: Record<string, any> }) {
    const { amount, metadata = {} } = body;
    const successUrl = `${process.env.Front_End_APP_URL}/partner/clinic-boost-package`;
    const cancelUrl = `${process.env.Front_End_APP_URL}/partner/clinic-boost-package`;
    console.log("metadata",metadata);
    const session = await this.paymentService.createCheckoutSession(amount, metadata, successUrl, cancelUrl);
    return { url: session.url, id: session.id };
  }



  @Post('create-account')
  @Version("1")
  async createAccount(@Body() body: { email: string, clinicuuid: string }) {

    const account = await this.paymentService.client.accounts.create({
      type: 'express',
      country: 'US',
      email: body.email,
     
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });


    

      await this.paymentService.updateStripeAccountID(account.id,body.clinicuuid);

    return {
      stripeAccountId: account.id,
    };


  }



@Post('onboard')
@Version("1")
async startOnboarding(@Body() body: { stripeAccountId: string }) {
  const accountLink =
    await this.paymentService.client.accountLinks.create({
      account: body.stripeAccountId,
      refresh_url: `${process.env.FRONT_END_PUBLI_URL}/stripe/refresh`,
      return_url: `${process.env.FRONT_END_PUBLI_URL}/stripe/success`,
      type: 'account_onboarding',
    });

  return {
    url: accountLink.url,
  };
}


@Post('status')
@Version('1')
async checkStatus(@Body() body: { stripeAccountId: string }) {
  const account =
    await this.paymentService.client.accounts.retrieve(
      body.stripeAccountId,
      {
        expand: ['external_accounts'],
      },
    );

  // Get bank account (if added)
  const bankAccount =
    account.external_accounts?.data?.find(
      (acc) => acc.object === 'bank_account',
    );

  return {
    account, // full Stripe account object (unchanged)

    accountHolderName:
      bankAccount?.account_holder_name ||
      account.individual?.first_name ||
      account.company?.name ||
      null,

    bankDetails: bankAccount
      ? {
          bankName: bankAccount.bank_name,
          last4: bankAccount.last4,
          currency: bankAccount.currency,
          country: bankAccount.country,
          accountHolderType: bankAccount.account_holder_type,
          routingNumber: bankAccount.routing_number || null,
          status: bankAccount.status,
        }
      : null,
  };
}



@Post('create-payment-intent')
@Version("1")
async createPaymentIntent(@Body() body: {
  amount: number;
  stripeAccountId: string;
}) {
  const paymentIntent =
    await this.paymentService.client.paymentIntents.create({
      amount: body.amount,
      currency: 'usd',
      application_fee_amount: Math.floor(body.amount * 0.1), // 10% fee
      transfer_data: {
        destination: body.stripeAccountId,
      },
    });

  return {
    clientSecret: paymentIntent.client_secret,
  };
}



@Post('create-shareable-payment-link')
@Version("1")
async createShareableLink(@Body() body: {
  amount: number;
  stripeAccountId: string;
  patientId: string;
  packageprice:string;
  finalprice:string;
  generatedlink:string;
  generatedamount:string;
  patientQueryId:string;
  displaytext :string;
  commission:string;

}) {


  console.log("body.displaytext",body.displaytext);
  const stripe = this.paymentService.client;

  const product = await stripe.products.create({
    name: body.displaytext || "Medical Consultation",
  });

  const price = await stripe.prices.create({
    unit_amount: body.amount * 100,
    currency: 'usd',
    product: product.id,
  });


 const paymentetailid = await this.paymentService.insertPatientQueryPaymentDetails(
      body.packageprice,
      body.finalprice,
      "",
      body.generatedamount,
      body.patientQueryId,
      body.commission,
      ""
    );


  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    metadata: {
      patientId: body.patientId,
      patientQueryId: body.patientQueryId,
      ids : paymentetailid.id
    },
    after_completion: {
      type: 'redirect',
        redirect: {
          url: `http://localhost:3000/consultation-success/${paymentetailid.id}`, 
        },
   },
  });



  await await this.paymentService.updatePatientQueryPaymentDetails(
    paymentetailid.id,
    paymentLink.url,
    paymentLink.id
  );

  console.log("paymentLink",paymentLink.id);

  return {
    paymentLink: paymentLink.url,
  };
}




@Post('pay-clinic')
async payVendor(@Body() body: {vendorStripeAccountId: string;vendorAmount: number;patientQueryId: string;})
{
  const stripe = this.paymentService.client;

  const balance = await stripe.balance.retrieve();

  console.log('Available:', balance.available);
  console.log('Pending:', balance.pending);



  const transfer = await stripe.transfers.create({
    amount: body.vendorAmount, 
    currency: 'usd',
    destination: body.vendorStripeAccountId,
    metadata: {
      patientQueryId: body.patientQueryId,
    },
  });

  return {
    success: true,
    transferId: transfer.id,
  };


}




@Post('update-ptient-query-payment-details')
async updatePaymentDetails(@Body() body:{
  id:string
}){

    return await this.paymentService.getPaymentLink(body.id);

}















  
}
