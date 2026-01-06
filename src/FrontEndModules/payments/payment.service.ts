import { Injectable } from '@nestjs/common';
import { PatientQueryPaymentStatus } from 'src/common/enum/PatientQueryPaymentStatus';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly prism:PrismaService) {
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


  get client() {
    return this.stripe;
  }


  async insertPatientQueryPaymentDetails(packageprice:string,finalprice:string,generatedlink:string,generatedamount:string,patientQueryId:string,commission:string,paymentLinkid:string)
  {

      console.log("body.displaytext",commission);
    const platformfee = ((Number(generatedamount) * Number(commission))/100);
    const vendorfee = (Number(generatedamount) - ((Number(generatedamount) * Number(commission))/100));

    const createData = await this.prism.patientQueryPaymentDetails.create({
      data :{
        packageprice : packageprice,
        finalprice : finalprice,
        generatedlink : generatedlink,
        generatedamount : generatedamount,
        patientQueryId : patientQueryId,
        commission : commission,
        platformfee : String(platformfee),
        vendorfee : String(vendorfee),
        paymentLinkid:paymentLinkid
      }
    });
    return {
       id:  createData.id
    }
  }



  async updatePatientQueryPaymentDetails(id:string,generatedlink:string,paymentLinkid:string){

    const updateData = await this.prism.patientQueryPaymentDetails.update({
      where :{
        id : id
      },
      data :{
          generatedlink : generatedlink,
          paymentLinkid : paymentLinkid
      }
    })
    return{
      staus : 200
    }
  }



  async getPaymentLink(id: string) {
  const getData = await this.prism.patientQueryPaymentDetails.findUnique({
    where: { id },
  });

  if (!getData?.paymentLinkid) {
    return { success: false, message: 'Payment link not found' };
  }

  const sessions = await this.stripe.checkout.sessions.list({
    payment_link: getData.paymentLinkid,
    limit: 5,
  });

  if (sessions.data.length === 0) {
    return { success: false, message: 'No checkout sessions found' };
  }

  // Get latest session
  const session = sessions.data.sort(
    (a, b) => (b.created ?? 0) - (a.created ?? 0)
  )[0];

  if (session.payment_status !== 'paid') {
    return {
      success: false,
      message: `Payment not completed. Status: ${session.payment_status}`,
      session,
    };
  }

  // Payment successful
  await this.prism.patientQueryPaymentDetails.update({
    where: { id },
    data: {
      status: PatientQueryPaymentStatus.SUCCESS,
      paymentLinkid: null,
    },
  });

  return {
    success: true,
    message: 'Payment successful',
    session,
  };
}




  async updateStripeAccountID(stripeaccountid:string,clinicuuid:string){

    const accountLink =
        await this.client.accountLinks.create({
          account: stripeaccountid,
          refresh_url: `${process.env.FRONT_END_PUBLI_URL}/stripe/refresh`,
          return_url: `${process.env.FRONT_END_PUBLI_URL}/stripe-onboarding-succes/${clinicuuid}`,
          type: 'account_onboarding',
        });



        await this.prism.clinic.update({
            where :{
              uuid : clinicuuid
            },
            data :{
              onboardingUrl : accountLink.url,
              stripeaccountid : stripeaccountid 
            }
        });



        console.log(accountLink.url,stripeaccountid,clinicuuid);
  }












}
