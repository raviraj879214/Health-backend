import { Injectable } from "@nestjs/common";
import { IRequests } from "../interface/request.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PatientQueryStatus } from "src/common/enum/patientQueryStatus";
import { RequestFundsCreateDto } from "./dto/request.create.dto";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import Stripe from "stripe";





@Injectable()
export class RequestServices implements IRequests{

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


    async getPatientQueryRequest(clinicuuid: string,clinicuserid:string,page: number, limit: number) {



const clinics = await this.prisma.clinic.findMany({
  where: { clinicUserUuid: clinicuserid },
  select: { uuid: true }, 
});

console.log("clinics", clinics);

const clinicIds = clinics.map(clinic => clinic.uuid);
console.log("clinicIds", clinicIds);


const assignedQueries = await this.prisma.patientQuery.findMany({
  where: {
    clinicId: { in: clinicIds },
    status: PatientQueryStatus.ASSIGNED,
  },
  include:{
    clinic:{
        include:{
            clinicUser : true
        }
    }
  },
  orderBy:{
    createdAt : "desc"
  },

   ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
            })
});

console.log("assignedQueries", assignedQueries);


const totalCount = await this.prisma.patientQuery.count({
    where:{
    clinicId: { in: clinicIds },
    status: PatientQueryStatus.ASSIGNED,
    }
});


        return{
            status : 200,
            data : assignedQueries,
            totalCount
        }
    }






    async getPatientQueryDetails(patientqueryid: string) {
      const getData = await this.prisma.patientQuery.findUnique({
        where:{
          id : patientqueryid
        },
        include:{
          clinic:true,
          package : true,
          doctor: true,
          PatientQueryOtherInformation : true
        }
      });

      return{
        status : 200,
        data : getData
      }
    }


     get client() {
        return this.stripe;
    }

    async RequestFunds(dto: RequestFundsCreateDto) {
      const stripe = this.client;
        const create = await this.prisma.requestFunds.create({
          data:{
            patientQueryId : dto.patientqueryid,
            amount : dto.amount,
            message : dto.message
          }
        });


        const transfers = await stripe.transfers.list();

        const filteredTransfers = transfers.data.filter(t => {
            return t.metadata &&  t.metadata.patientqueryid === dto.patientqueryid
        });
       



              const patientquerydetails = await this.prisma.patientQuery.findUnique({where:{id : dto.patientqueryid},include:{clinic:{include:{clinicUser:true}}}});
              const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
              let payload: WebhookNotificationDto = {
                      title: `Requested Funds  to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
                      area: "admin",
                      message: `Requested Funds  to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`,
              };
              await this.universalNotification.HandleNotification(payload);
      
              let payloadclinic: WebhookNotificationDto = {
                      title: `Requested Funds  to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
                      area: "",
                      id : patientquerydetails?.clinic?.clinicUserUuid! ,
                      message: `Requested Funds  to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`,
              };
              await this.universalNotification.HandleNotification(payloadclinic);
      
               const htmlContentAdmin = EmailTemplate.getTemplate(`Requested Funds  to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`);
               await this.emailservice.sendEmail(
                   adminemail?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Requested Funds  to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
                   "",
                   htmlContentAdmin
                   
               );
               const htmlContentClinic = EmailTemplate.getTemplate(`Requested Funds have been received to the clinic ${patientquerydetails?.clinic?.name} for patient query code ${patientquerydetails?.querycode}.`);

              //  await this.emailservice.sendEmail(
              //      patientquerydetails?.clinic?.clinicUser?.email!,
              //      `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `Requested Funds to Clinic ${patientquerydetails?.clinic?.name} for Patient Query - ${patientquerydetails?.querycode}`,
              //      "",
              //      htmlContentClinic
              //  );
              

      return{
        status : 200,
        data : create,
        transfer : filteredTransfers
      }

    }



    async GEtRequestFunds(patientqueryid: string) {
      const stripe = this.client;
      const getData = await this.prisma.requestFunds.findMany({
        where:{
          patientQueryId : patientqueryid
        },
        orderBy:{
          createdAt : "desc"
        }
      });

      const transfers = await stripe.transfers.list();

        const filteredTransfers = transfers.data.filter(t => {
            return t.metadata &&  t.metadata.patientqueryid === patientqueryid
        });
        

      return{
        status : 200 ,
        requestedfunds : getData,
        transfer : filteredTransfers
      }

    }




}