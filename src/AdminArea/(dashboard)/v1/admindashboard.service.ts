import { Injectable } from "@nestjs/common";
import { IAdminDashboard } from "../interface/admin.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";




@Injectable()
export class AdminDasboardServices implements IAdminDashboard{

    private stripe: Stripe;
    constructor(private readonly prisma:PrismaService){

        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2025-10-29.clover",
        });

    }


    async getDashboardData() {

        const patientquery = await this.prisma.patientQuery.findMany({});
        const clinic = await this.prisma.clinic.findMany({});
        const balance = await this.stripe.balance.retrieve();
        const stripeaccount= await this.stripe.accounts.list({});

        const stripeAccounts = await this.stripe.accounts.list({
            limit: 100,
        });

        const formattedAccounts = stripeAccounts.data.map((account) => {


            let accountName = "N/A";

            if (account.business_profile?.name) {
                accountName = account.business_profile.name;
            } else if (account.company?.name) {
                accountName = account.company.name;
            } else if (account.individual) {
                accountName = `${account.individual.first_name || ""} ${account.individual.last_name || ""}`.trim();
            }

            return {
                accountId: account.id,
                name: accountName,
                accountCountry: account.country,
                businessType: account.business_type,
                cardPaymentsCapabilityStatus:
                    account.capabilities?.card_payments || "inactive",
                accountStatus:
                    account.charges_enabled && account.payouts_enabled
                        ? "Active"
                        : "Restricted",
                onboardingStatus: account.details_submitted
                    ? "Completed"
                    : "Pending",
                connectedOn: account.created
                    ? new Date(account.created * 1000)
                    : null,
            };
        });




        return {
            patientquery: patientquery,
            clinic:clinic,
            stripebalance : balance.available,
            stripeaccount:formattedAccounts,
            status : true
        }
    }

    get client() {
        return this.stripe;
    }


     async getStripeAccountDetails(accountid: string) {

        const account = await this.stripe.accounts.retrieve();
        const balance = await this.stripe.balance.retrieve();

        return {
            accountId: account.id,
            email: account.email,
            country: account.country,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            availableBalance: balance.available,
            pendingBalance: balance.pending,
        };

    }


}



