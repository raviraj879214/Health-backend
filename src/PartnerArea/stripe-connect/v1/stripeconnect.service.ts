import { Injectable } from "@nestjs/common";
import { IStripeConnect } from "../interface/stripeconnect.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";







@Injectable()
export class StripeConnectService implements IStripeConnect{
    private stripe: Stripe;
    constructor(
        private readonly prisma:PrismaService,
         private readonly universalNotification:UniversalNotification,
            private emailservice : EmailService

    ){
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-10-29.clover",
    });
    }

      get client() {
        return this.stripe;
    }


    async updateStripeConnectAccount(id: string) {

            const getData = await this.prisma.clinic.findUnique({
                where :{
                    uuid : id
                     
                }
            });

             console.log("status",getData?.isStripeVerify);
            if(getData?.isStripeVerify == 'ACTIVE'){
                 console.log("status",getData?.isStripeVerify);
                return {
                    status : 404
                }
            }


            //  await this.stripe.accounts.update(String(getData?.stripeaccountid), {
            //     business_profile: {
            //         mcc: "8011" 
            //     }
            // });

       
            const account = await this.client.accounts.retrieve(String(getData?.stripeaccountid));

           

            let status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'RESTRICTED' = 'PENDING';

            

            if (account.charges_enabled && account.payouts_enabled) {


                status = 'ACTIVE';

                 console.log("status",status);

                let payload: WebhookNotificationDto = {
                    title: `Stripe Onboarding Completed - ` + getData?.name,
                    area: "admin",
                    message: `A clinic ${getData?.name} has finished Stripe onboarding. Review the clinic profile and activate it to allow payment transfers.`
                };



                await this.universalNotification.HandleNotification(payload);

                const adminemail = await this.prisma.user.findFirst({ where: { role: { name: "SuperAdmin" } }, select: { email: true } });
                console.log("adminemail?.email", adminemail?.email);
                const emailText = `A clinic ${getData?.name} has finished Stripe onboarding. Review the clinic profile and activate it to allow payment transfers.`;
                const htmlContent = EmailTemplate.getTemplate(emailText);
                await this.emailservice.sendEmail(
                    adminemail?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Stripe Onboarding Completed - ` + getData?.name,
                    "",
                    htmlContent
                );

               
                


            } 
            else if (account.requirements?.disabled_reason) 
            {
                status = 'RESTRICTED';
            } 
            else if ((account.requirements?.currently_due?.length ?? 0) > 0) 
            {
                status = 'PAUSED';
            }
            await this.prisma.clinic.update({
                where :{
                    uuid : id
                },
                data :{
                    isStripeVerify : status
                }
            });


              
                


            

            console.log(status);
            return{
                status : 200,
                account
            }



    }








}