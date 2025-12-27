import { Injectable } from "@nestjs/common";
import { IManagePayout } from "../interface/manageapyout.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";
import { ManagePayoutUpdateDto } from "./dto/manageapyout.update.dto";
import { PatientQueryPaymentStatus } from "src/common/enum/PatientQueryPaymentStatus";







@Injectable()
export class ManagePayoutServices implements IManagePayout{

     private stripe: Stripe;
    constructor(private readonly prisma:PrismaService){
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-10-29.clover",
    });
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




    async getClinicList() {
        const getData = await this.prisma.clinic.findMany({});


        return {
            data : getData
        }
    }



    async getClinicDetails(id: string) {
        const getData = await this.prisma.clinic.findUnique({
            where : {uuid : id},
            include : {
                packages :{
                    include :{
                        queries : {
                            include :{
                                paymentDetails : {
                                    where :{
                                        status : PatientQueryPaymentStatus.SUCCESS
                                    }
                                }
                            }
                        }
                    }
                }
            
            }
        });

        return{
            data : getData
        }
    }




    async payoutClinic(dto: ManagePayoutUpdateDto) {

        const stripe = this.client;

        const balance = await stripe.balance.retrieve();

        console.log('Available:', balance.available);
        console.log('Pending:', balance.pending);



        const transfer = await stripe.transfers.create({
            amount: Number(dto.amount),
            currency: 'usd',
            destination: String(dto.vendorStripeAccountId),
            description : dto.description,
            metadata: {
                packageid: dto.packageid,
                clinicid : dto.clinicid,
                patientqueryid : dto.patientqueryid
            },
        });

        return {
            success: true,
            transferId: transfer.id,
        };




    }



async getTransferTransaction(dto: ManagePayoutUpdateDto) {
    const stripe = this.client;

    try {
        const transfers = await stripe.transfers.list({ limit: 10 });

        const filteredTransfers = transfers.data.filter(t => {
            return t.metadata && t.metadata.clinicid === dto.clinicid && t.metadata.packageid === dto.packageid && t.metadata.patientqueryid === dto.patientqueryid
        });



        return {
            success: true,
            message: 'Transfers fetched successfully',
            data: filteredTransfers,  
        };
    } catch (error) {
        console.error('Error fetching transfers:', error);

        return {
            success: false,
            message: 'Failed to fetch transfers',
            error: error.message || error,
        };
    }
}




   







}