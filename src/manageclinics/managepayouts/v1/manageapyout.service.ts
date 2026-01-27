import { Injectable } from "@nestjs/common";
import { IManagePayout } from "../interface/manageapyout.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";
import { ManagePayoutUpdateDto } from "./dto/manageapyout.update.dto";
import { PatientQueryPaymentStatus } from "src/common/enum/PatientQueryPaymentStatus";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";







@Injectable()
export class ManagePayoutServices implements IManagePayout{

     private stripe: Stripe;
    constructor(
        private readonly prisma:PrismaService,
        private emailservice : EmailService,
        private readonly universalNotification:UniversalNotification
    ){
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




   




//23-01-2026



    async getPatientQuery(adminid: number) {


        const AdminDetails = await this.prisma.user.findUnique({
            where: {
                id: adminid
            },
            include: {
                role: true
            }
        });

        var cordinatorid = 0;

        if (AdminDetails?.role.name === "Cordinator") {
            cordinatorid = AdminDetails.id;
        }
        else {
            const coordinator = await this.prisma.user.findFirst({
                where: {
                    id: adminid,
                    role: {
                        name: "Super Admin",
                    },
                },
                select: {
                    id: true,
                },
            });

            const coordinatorId = coordinator?.id;
        }


        const queryWhere: any = {};
        if (cordinatorid > 0) {
            queryWhere.cordinatorid = adminid;
        }





        const getData = await this.prisma.patientQuery.findMany({
            where: queryWhere,
            include: {
                package: true,
                clinic: true,
                doctor: true,
                User: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        return {
            status: 200,
            data: getData
        }
    }

    async getPatinetQueryTransaction(patientqueryid: string) {
    const stripe = this.client;

    try {
        let hasMore = true;
        let startingAfter: string | undefined = undefined;

        const matched: Stripe.PaymentIntent[] = [];

        while (hasMore) {
        const res = await stripe.paymentIntents.list({
            limit: 100,
            starting_after: startingAfter,
        });

        for (const pi of res.data) {
            if (pi.metadata?.patientQueryId === patientqueryid) {
            matched.push(pi);
            }
        }

        hasMore = res.has_more;
            startingAfter = res.data[res.data.length - 1]?.id;
        }

         const transfers = await stripe.transfers.list();

        const filteredTransfers = transfers.data.filter(t => {
            return t.metadata &&  t.metadata.patientqueryid === patientqueryid
        });


        return {
            success: true,
            message: "PaymentIntents fetched successfully",
            data: matched,
            transfer : filteredTransfers
        };


    } catch (error) {
        return {
        success: false,
        message: "Failed to fetch transactions",
        error: error.message || error,
        };
    }
    }




     async releaseFundVendor(verndoraccountid:string,patientqueryid:string,note:string,amount:string) {

        const stripe = this.client;

        const balance = await stripe.balance.retrieve();

        console.log('Available:', balance.available[0].amount);
        console.log('Pending:', balance.pending[0].amount);

        const numericAmount = Number(amount);

           
        const availableAmount = balance.available[0].amount ?? 0;
         console.log('Available:', availableAmount);

        if (availableAmount <= numericAmount) {
            return {
                status : 401,
                message : "balance not available"
            };
        } 

        
         const transfer = await stripe.transfers.create({
            amount: (Number(amount) * 100),
            currency: 'usd',
            destination: String(verndoraccountid),
            description : note,
            metadata: {
                patientqueryid : patientqueryid
            },
        });


        const patientquerydetails = await this.prisma.patientQuery.findUnique({where:{id : patientqueryid},include:{clinic:{include:{clinicUser:true}}}});
        const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
        let payload: WebhookNotificationDto = {
                title: `Funds Transferred to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
                area: "admin",
                message: `Funds have been transferred to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`,
        };
        await this.universalNotification.HandleNotification(payload);

        let payloadclinic: WebhookNotificationDto = {
                title: `Funds Received to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
                area: "",
                id : patientquerydetails?.clinic?.clinicUserUuid! ,
                message: `Funds have been received to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`,
        };
        await this.universalNotification.HandleNotification(payloadclinic);

         const htmlContentAdmin = EmailTemplate.getTemplate(`Funds have been transferred to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`);
         await this.emailservice.sendEmail(
             adminemail?.email!,
             `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Funds Transferred to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
             "",
             htmlContentAdmin
             
         );
         const htmlContentClinic = EmailTemplate.getTemplate(`Funds have been received to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`);
         await this.emailservice.sendEmail(
             patientquerydetails?.clinic?.clinicUser?.email!,
             `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Funds Received to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
             "",
             htmlContentClinic
         );




        return {
            success: true,
            transferId: transfer.id,
        };
    }





}