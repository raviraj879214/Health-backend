import { Injectable } from "@nestjs/common";
import { IStripeConnect } from "../interface/stripeconnect.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";







@Injectable()
export class StripeConnectService implements IStripeConnect{
    private stripe: Stripe;
    constructor(private readonly prisma:PrismaService){
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-10-29.clover",
    });
    }

      get client() {
        return this.stripe;
    }


    async updateStripeConnectAccount(id: string) {

            const getData = await this.prisma.clinic.findUnique({
                where :{uuid : id,
                    isStripeVerify :null
                }
            });

            if(!getData){
                return {
                    status : 404
                }
            }

             await this.stripe.accounts.update(String(getData?.stripeaccountid), {
                business_profile: {
                    mcc: "8011" 
                }
            });

       
            const account = await this.client.accounts.retrieve(String(getData?.stripeaccountid));

           

            let status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'RESTRICTED' = 'PENDING';

            if (account.charges_enabled && account.payouts_enabled) {
                     status = 'ACTIVE';
            } else if (account.requirements?.disabled_reason
            ) 
            {
                     status = 'RESTRICTED';
            } else if ((account.requirements?.currently_due?.length ?? 0) > 0) {
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