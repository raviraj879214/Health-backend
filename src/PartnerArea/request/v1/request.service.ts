import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IRequests } from "../interface/request.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PatientQueryStatus } from "src/common/enum/patientQueryStatus";
import { RequestFundsCreateDto } from "./dto/request.create.dto";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import Stripe from "stripe";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { PackageQueryFinalPriceStatus } from "src/common/enum/PackageQueryFinalPriceStatus";
import { brazilianCurrency } from "src/common/currencyFormat/brazilianCurrency";





@Injectable()
export class RequestServices implements IRequests{

   private stripe: Stripe;
    constructor(
      private readonly prisma:PrismaService,
      private emailservice : EmailService,
      private readonly universalNotification:UniversalNotification,
      private readonly httpService: HttpService

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
    NOT:{
      status : PatientQueryStatus.PENDING
    }
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
          PatientQueryOtherInformation : true,
          User : true,
          PatientQueryFinalPrice : {
            orderBy : {
              createdAt : "desc"
            }
          }
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
                      id : String(patientquerydetails?.cordinatorid),
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









   async getPalcesid(input: string) {
    try {
      // Step 1: Find Place by text
      const findPlaceUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
      const findPlaceParams = {
        input,
        inputtype: 'textquery',
        fields: 'place_id,name,formatted_address,photos',
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      };

      const findPlaceResponse = await firstValueFrom(
        this.httpService.get(findPlaceUrl, { params: findPlaceParams }),
      );

      const candidates = findPlaceResponse.data.candidates;
      if (!candidates || candidates.length === 0) {
        return { message: 'No place found' };
      }

      const place = candidates[0];

      // Step 2: Fetch detailed info (rating, total reviews, opening hours)
      const placeDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
      const placeDetailsParams = {
        place_id: place.place_id,
        fields: 'name,rating,user_ratings_total,formatted_address,photos,opening_hours,types',
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      };

      const detailsResponse = await firstValueFrom(
        this.httpService.get(placeDetailsUrl, { params: placeDetailsParams }),
      );

      const details = detailsResponse.data.result;

      return {
        place_id: place.place_id,
        name: details.name,
        address: details.formatted_address,
        rating: details.rating || null,
        total_ratings: details.user_ratings_total || 0,
        photos: details.photos || [],
        opening_hours: details.opening_hours || null,
        types: details.types || [],
      };


    } catch (error) {
      console.error('Error fetching place info:', error.message);
      throw new HttpException('Failed to fetch place info', HttpStatus.BAD_REQUEST);
    }
   }


  async updateGooglePlacesID(dto: { placesid: string; uuid: string; }) {

    const updateData = await this.prisma.clinic.update({
      where:{
        uuid : dto.uuid
      },
      data:{
        placesid : dto.placesid
      }
    });

    const payload: WebhookNotificationDto = {
      title: `Clinic Google Review Profile Update: ${updateData.name}`,
      area: "admin",
      message: `The clinic "${updateData.name}" has updated its Google review profile. Please check the clinic details page and review it.`
    };

    await this.universalNotification.HandleNotification(payload);


    return {
      status : 200,
      data : updateData
    }
    
  }
  


  async getClinicDetails(uuid: string) {
    const getData = await this.prisma.clinic.findUnique({
      where :{
        uuid : uuid
      }
    });

    return {
      status : 200,
      data : getData
    }
  }

  

  async getGooglePlaces(placesid: string) {

      const placeDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
      const placeDetailsParams = {
        place_id: placesid,
        fields: 'name,rating,user_ratings_total,formatted_address,photos,opening_hours,types',
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      };

      const detailsResponse = await firstValueFrom(
        this.httpService.get(placeDetailsUrl, { params: placeDetailsParams }),
      );

      const details = detailsResponse.data.result;

      return {
        place_id: placesid,
        name: details.name,
        address: details.formatted_address,
        rating: details.rating || null,
        total_ratings: details.user_ratings_total || 0,
        photos: details.photos || [],
        opening_hours: details.opening_hours || null,
        types: details.types || [],
      };

  }




  async updatepatientQuery(queryid: string, status: string,reason:string) {

  let updatedata;

    if (Number(status) === PatientQueryStatus.REJECT) {

      updatedata = await this.prisma.patientQuery.update({
        where: {
          id: queryid
        },
        data: {
          status: Number(status),
          reason: reason,
          finalPrice: null
        },
        include: {
          clinic: true
        }
      });

      await this.prisma.patientQueryFinalPrice.updateMany({
        where:{
          patientQueryId : queryid
        },
        data :{
          status : PackageQueryFinalPriceStatus.REJECT
        }
      });

    } else {

      updatedata = await this.prisma.patientQuery.update({
        where: {
          id: queryid
        },
        data: {
          status: Number(status),
          reason: reason
        },
        include: {
          clinic: true
        }
      });
    }



    let labeltext = PatientQueryStatus.ACCEPT === Number(status) ? "Accepted" : (PatientQueryStatus.REJECT === Number(status) ? "Rejected" : "");

    let payload: WebhookNotificationDto = {
                        title: `The patient query #${updatedata.querycode} has been successfully ${labeltext} by the clinic ${updatedata.clinic?.name}.`,
                        area: "admin",
                        message: `The patient query #${updatedata.querycode} has been ${labeltext} by clinic ${updatedata.clinic?.name}. Reason: ${updatedata.reason}.`,
                };
    await this.universalNotification.HandleNotification(payload);

      const cordinatordetails = await this.prisma.user.findFirst({ where: { id: Number(updatedata.cordinatorid) } });
      let payloadcordinator: WebhookNotificationDto = {
                        title: `The patient query #${updatedata.querycode} has been successfully ${labeltext} by the clinic ${updatedata.clinic?.name}.`,
                        area: "",
                        id : String(updatedata.cordinatorid),
                        message: `The patient query #${updatedata.querycode} has been ${labeltext} by clinic ${updatedata.clinic?.name}. Reason: ${updatedata.reason}.`,
                };
      await this.universalNotification.HandleNotification(payloadcordinator);

       const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
       const htmlContentAdmin = EmailTemplate.getTemplate(``);

          await this.emailservice.sendEmail(
                   adminemail?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - The patient query #${updatedata.querycode} has been successfully ${labeltext} by the clinic ${updatedata.clinic?.name}`,
                   `The patient query #${updatedata.querycode} has been ${labeltext} by clinic ${updatedata.clinic?.name}. Reason: ${updatedata.reason}.`,
                   htmlContentAdmin
           );

          await this.emailservice.sendEmail(
                   cordinatordetails?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - The patient query #${updatedata.querycode} has been successfully ${labeltext} by the clinic ${updatedata.clinic?.name}`,
                   `The patient query #${updatedata.querycode} has been ${labeltext} by clinic ${updatedata.clinic?.name}. Reason: ${updatedata.reason}.`,
                   htmlContentAdmin
           );



    return{
      status : 200,
      data : updatedata
    }


  }


  async finalPriceMakeAction(action: string, id: string, reason: string) {

    const update = await this.prisma.patientQueryFinalPrice.update({
      where: {
        id: id
      },
      data: {
        reason: reason,
        status: Number(action === "accept" ? PackageQueryFinalPriceStatus.ACCEPT : (action === "reject" ? PackageQueryFinalPriceStatus.REJECT : null))
      },
      include:{
        PatientQuery : true,
        Clinic : true,
        
      }
    });


    if(action === "reject"){


      await this.prisma.patientQuery.update({
        where:{
          id : update.patientQueryId
        },
        data :{
          finalPrice : null
        }
      });




            let payload: WebhookNotificationDto = {
                      title:`The clinic ${update.Clinic?.name} has rejected the final price  requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                      area: "admin",
                      message: `The clinic ${update.Clinic?.name} has rejected the final price  requested by the coordinator for query #${update.PatientQuery.querycode}.`,
              };
              await this.universalNotification.HandleNotification(payload);
      
              let payloadclinic: WebhookNotificationDto = {
                      title: `The clinic ${update.Clinic?.name} has rejected the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                      area: "",
                      id : String(update.PatientQuery.cordinatorid),
                      message: `The clinic ${update.Clinic?.name} has rejected the final price  requested by the coordinator for query #${update.PatientQuery.querycode}.`,
              };
              await this.universalNotification.HandleNotification(payloadclinic);


               const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
               const cordinatordetails = await this.prisma.user.findFirst({where:{id : Number(update.PatientQuery.cordinatorid)}});
               const htmlContentAdmin = EmailTemplate.getTemplate(`The clinic ${update.Clinic?.name} has rejected the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`);

               await this.emailservice.sendEmail(
                    adminemail?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The clinic ${update.Clinic?.name} has rejected the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                   "",
                   htmlContentAdmin
               );
               await this.emailservice.sendEmail(
                    cordinatordetails?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The clinic ${update.Clinic?.name} has rejected the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                   "",
                   htmlContentAdmin
               );






    }
    else{





              let payload: WebhookNotificationDto = {
                      title:`The clinic ${update.Clinic?.name} has accepted the final price  requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                      area: "admin",
                      message: `The clinic ${update.Clinic?.name} has accepted the final price  requested by the coordinator for query #${update.PatientQuery.querycode}.`,
              };
              await this.universalNotification.HandleNotification(payload);
      
              let payloadclinic: WebhookNotificationDto = {
                      title: `The clinic ${update.Clinic?.name} has accepted the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                      area: "",
                      id : String(update.PatientQuery.cordinatorid),
                      message: `The clinic ${update.Clinic?.name} has accepted the final price  requested by the coordinator for query #${update.PatientQuery.querycode}.`,
              };
              await this.universalNotification.HandleNotification(payloadclinic);


               const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
               const cordinatordetails = await this.prisma.user.findFirst({where:{id : Number(update.PatientQuery.cordinatorid)}});
               const htmlContentAdmin = EmailTemplate.getTemplate(`The clinic ${update.Clinic?.name} has accepted the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`);

               await this.emailservice.sendEmail(
                    adminemail?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The clinic ${update.Clinic?.name} has accepted the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                   "",
                   htmlContentAdmin
               );
               await this.emailservice.sendEmail(
                    cordinatordetails?.email!,
                   `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The clinic ${update.Clinic?.name} has accepted the final price requested by the coordinator for query #${update.PatientQuery.querycode}.`,
                   "",
                   htmlContentAdmin
               );

    }

    return {
      status: 200,
      data : update

    }

  }


}