import { Inject, Injectable } from "@nestjs/common";
import { IReport } from "../interface/report.interface";
import { PrismaService } from "src/prisma/prisma.service";
import Stripe from "stripe";










@Injectable()
export class ReportService implements IReport{
  private stripe: Stripe;
  constructor(private readonly prisma:PrismaService){
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-10-29.clover",
    });
  }

   get client() {
    return this.stripe;
  }



async getStripeTransaction(startingAfter?: string) {

  const response = await this.client.balanceTransactions.list({
    limit: 100,
    starting_after: startingAfter,
    created: {
      gte: Math.floor(new Date("2026-03-19").getTime() / 1000),
      lte: Math.floor(new Date().getTime() / 1000),
    },
    expand: [
      "data.source",
      "data.source.destination",
      "data.source.payment_intent",
      "data.source.customer" // 👈 add this
    ],
  });

  const patientQueryCode = await this.prisma.patientQuery.findMany({
    select: {
      id: true,
      querycode: true
    }
  });

  const transactions = response.data.map((txn: any) => {

    // ================= TRANSFER =================
    if (txn.type === "transfer") {
      const transfer = txn.source;

      return {
        ...txn,
        transferId: transfer?.id,
        destinationAccountId:
          typeof transfer?.destination === "string"
            ? transfer.destination
            : transfer?.destination?.id,

        destinationAccount:
          typeof transfer?.destination === "object"
            ? transfer.destination
            : null,
      };
    }

    // ================= CHARGE =================
    if (txn.type === "charge") {
      const charge = txn.source;

      return {
        ...txn,

        // 👇 Customer Info
        customerId:
          typeof charge?.customer === "string"
            ? charge.customer
            : charge?.customer?.id,

        customerEmail:
          charge?.billing_details?.email ||
          charge?.customer?.email ||
          null,

        customerName:
          charge?.billing_details?.name ||
          charge?.customer?.name ||
          null,

        paymentIntentId:
          typeof charge?.payment_intent === "string"
            ? charge.payment_intent
            : charge?.payment_intent?.id,
      };
    }

    return txn;
  });

  return {
    patientQueryCode: patientQueryCode,
    count: transactions.length,
    transactions: transactions,
    hasMore: response.has_more,
    lastId: transactions.length
      ? transactions[transactions.length - 1].id
      : null,
  };
}



async getPatientQueryCodes() {

   const data= await this.prisma.patientQuery.findMany({
    select:{
      id : true,
      querycode : true
    }
   });

   return {
    data : data
   }

}



}