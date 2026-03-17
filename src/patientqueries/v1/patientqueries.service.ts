import { BadRequestException, Injectable } from "@nestjs/common";
import { IPatientQueries } from "../interface/patientqueries.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PatientQueryCreateDto } from "./dto/patientqueries.create.dto";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { ActivityLogService } from "src/middleware/activitylogg/activity-log.service";
import { brazilianCurrency } from "src/common/currencyFormat/brazilianCurrency";
import { randomUUID } from "crypto";
import { PackageQueryFinalPriceStatus } from "src/common/enum/PackageQueryFinalPriceStatus";
import { PatientQueryStatus } from "src/common/enum/patientQueryStatus";
import { PatientQueryPaymentStatus } from "src/common/enum/PatientQueryPaymentStatus";
import { UrlGeneratorService } from "src/common/urlgenerator/UrlGenerate";



const getStatusLabel = (status: number): string => {
  switch (Number(status)) {
    case PatientQueryStatus.PENDING:
      return "Pending";

    case PatientQueryStatus.ASSIGNED:
      return "Assigned";

    case PatientQueryStatus.ACCEPT:
      return "Accepted";

    case PatientQueryStatus.REJECT:
      return "Rejected";

    case PatientQueryStatus.UNDER_REVIEW:
      return "Under Review";

    case PatientQueryStatus.WAITING_FOR_INFO:
      return "Waiting For Info";

    case PatientQueryStatus.OFFER_SENT:
      return "Offer Sent";

    case PatientQueryStatus.APPOINTMENT_BOOKED:
      return "Appointment Booked";

    case PatientQueryStatus.PATIENT_ARRIVED:
      return "Patient Arrived";

    case PatientQueryStatus.TREATMENT_ONGOING:
      return "Treatment Ongoing";

    case PatientQueryStatus.TREATMENT_COMPLETED:
      return "Treatment Completed";

    case PatientQueryStatus.TREATMENT_UNSUCCESSFUL:
      return "Treatment Unsuccessful";


    case PatientQueryStatus.REOPENREQUEST:
    return "Reopen Requested";

      case PatientQueryStatus.REOPENED:
          return "Reopened";

      case PatientQueryStatus.FUNDS_RELEASED:
          return "Funds Released";

      case PatientQueryStatus.COMPLETED:
          return "Completed";

      case PatientQueryStatus.CLOSED:
          return "Closed";

      case PatientQueryStatus.PAYMENT_PENDING:
          return "Payment Pending";





    default:
      return "Unknown Status";
  }
};


@Injectable()
export class PatientQueriesServices implements IPatientQueries{
    constructor(private readonly prisma:PrismaService,
         private emailservice : EmailService,
         private readonly universalNotification:UniversalNotification,
         private readonly activityLogService: ActivityLogService,
         private readonly urlGenerator: UrlGeneratorService
    ){}


    

    async getPateintQueries(page: number, limit: number,adminid:number) {


        const AdminDetails = await this.prisma.user.findUnique({
            where :{
                id : adminid
            },
            include:{
                role : true
            }
        });

        var cordinatorid = 0;

        if(AdminDetails?.role.name === "Cordinator"){
            cordinatorid = AdminDetails.id;
        }
        else{
            const coordinator = await this.prisma.user.findFirst({
                where: {
                    id : adminid,
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
        

        const totalCount = await this.prisma.patientQuery.count();


        const getData = await this.prisma.patientQuery.findMany({
            where: queryWhere,
               include:{
                package : true,
                clinic : true,
                doctor : true,
                User : true,
                PatientQueryFinalPrice : {
                    orderBy : {
                        createdAt : 'desc'
                    },
                    take : 1
                },
                RequestFunds : true
               },
            orderBy:{
                createdAt : 'desc'
            },
                
            
             ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
                })
        });

        return {
            status : 200,
            data : getData,
             totalCount
        }
    }


    async getPatientQueryDetails(id: string) {
        const getData = await this.prisma.patientQuery.findUnique({
            where :{
                id : id
            },
            include:{
                
                clinic : true,
                package : true,
                doctor : true,
                paymentDetails : {
                    orderBy :{
                        createdAt : "desc"
                    }
                },
                PatientQueryFinalPrice : {
                    orderBy : {createdAt : "desc"},
                    include:{
                        Clinic : true
                    }
                }

                
            }
        });

        return {
            status : 200,
            data : getData
        }
    }


    async insertFinalDealPrice(dto: PatientQueryCreateDto,userid:string) {
        
        const createData = await this.prisma.patientQuery.update({
            where :{
                id : dto.patientqueryid
            },
            data :{
                finalPrice : null
            },
            include:{
                clinic :true,
                
            }
        });

        await this.prisma.patientQueryFinalPrice.create({
            data:{
                id: randomUUID(),
                finalPrice : Number(dto.finalprice),
                patientQueryId : createData.id,
                clinicId : createData.clinicId,
                status : PackageQueryFinalPriceStatus.PENDING
            }
        });


         if((createData.status === PatientQueryStatus.ASSIGNED || createData.status === PatientQueryStatus.ACCEPT)){

             const  patientqueryurl= this.urlGenerator.urls.clinic_request_details(createData.id);
            let payload: WebhookNotificationDto = {
                    page : patientqueryurl,
                    title:`The coordinator has submitted a final deal price of ${brazilianCurrency(createData.finalPrice)} to the clinic ${createData.clinic?.name} for query #${createData.querycode}.`,
                    area: "admin",
                    message: `The coordinator has submitted a final deal price of ${brazilianCurrency(createData.finalPrice)} to the clinic ${createData.clinic?.name} for query #${createData.querycode}.`,
            };
            await this.universalNotification.HandleNotification(payload);
            let payloadclinic: WebhookNotificationDto = {
                    page : patientqueryurl,
                    title: `The coordinator has submitted a final deal price of ${brazilianCurrency(createData.finalPrice)} to the clinic ${createData.clinic?.name} for query #${createData.querycode}.`,
                    area: "",
                    id : String(createData.clinic?.clinicUserUuid),
                    message: `The coordinator has submitted a final deal price of ${brazilianCurrency(createData.finalPrice)} to the clinic ${createData.clinic?.name} for query #${createData.querycode}.`,
            };
            await this.universalNotification.HandleNotification(payloadclinic);
            const htmlContentAdmin = EmailTemplate.getTemplate(`The coordinator has submitted a final deal price of ${brazilianCurrency(createData.finalPrice)} to the clinic ${createData.clinic?.name} for query #${createData.querycode}.`);
            await this.emailservice.sendEmail(
                createData.clinic?.email!,
                `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The coordinator has submitted a final deal price of ${brazilianCurrency(createData.finalPrice)} to the clinic ${createData.clinic?.name} for query #${createData.querycode}.`,
                "",
                htmlContentAdmin
            );

         }

            



                const ipAddress= "0.0.0.0";
                const userAgent= "any browser";
                await this.activityLogService.createLog({
                    userId : Number(userid),
                    action: `Patient Query Final Deal Price - #${createData.querycode} Price ${brazilianCurrency(dto.finalprice)}`,
                    description: `The coordinator has finalized the deal and communicated the agreed amount of ${brazilianCurrency(dto.finalprice)}.`,
                    entityType: "finalDealPrice",
                    entityId: Number(userid),
                    ipAddress,
                    userAgent,
                });



                return {
                    status : 200,
                    data : createData
                }

    }



    async getClinicList() {
        const data = await this.prisma.clinic.findMany({});

        return{
            status : 200,
            data : data
        }
    }




    async assignClinicToPatientQuery(clinicid: string, queryid: string,userid:string) {
        const prevPatientQuery = await this.prisma.patientQuery.findFirst({where:{id : queryid},include:{clinic:true}});
        const updateData = await this.prisma.patientQuery.update({
            where :{
                id : queryid
            },
            data :{
                clinicId : clinicid,
                packageId : null,
                doctorid : null
            },
            include:{
                clinic : true
            }
        });

        const ipAddress = "0.0.0.0";
        const userAgent = "any browser";
        await this.activityLogService.createLog({
            userId: Number(userid),
            action: `Patient Query Clinic Added/Updated - #${updateData.querycode}`,
            description: prevPatientQuery?.clinic?.name ? `The coordinator has updated the clinic from ${prevPatientQuery.clinic.name} to ${updateData.clinic?.name || "N/A"} for patient query #${updateData.querycode}.`: `The coordinator has added the clinic ${updateData.clinic?.name || "N/A"} for patient query #${updateData.querycode}.`,
            entityType: "clinicAssign",
            entityId: Number(userid),
            ipAddress,
            userAgent,
        });







        return {
            status : 200,
            data : updateData
        }
    }


 isUUID(value: string) {
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

    async getPackagesList(clinicid: string) {
        if (!this.isUUID(clinicid)) {
    throw new BadRequestException('Invalid clinicId (UUID required)');
  }
        const getData = await this.prisma.clinicPackage.findMany({
            where:{
                clinicId : clinicid
            }
        });

        return{
            status : 200,
            data : getData
        }
    }



    async assignPackageToQuery(packageId: string, queryid: string,userid:string) {

        const prevPatientQuery = await this.prisma.patientQuery.findFirst({where:{id : queryid},include:{package:true}});

        const updateData = await this.prisma.patientQuery.update({
            where :{
                id : queryid
            },
            data :{
                packageId : packageId
            },
            include:{
                package:true
            }
        });


        const ipAddress = "0.0.0.0";
        const userAgent = "any browser";
        await this.activityLogService.createLog({
            userId: Number(userid),
            action: `Patient Query Package Added/Updated - #${updateData.querycode}`,
            description: prevPatientQuery?.package?.title ? `The coordinator has updated the package from  ${prevPatientQuery.package.title}  to ${updateData.package?.title || "N/A"}  for patient query #${updateData.querycode}.`: `The coordinator has added the package  ${updateData.package?.title || "N/A"}  for patient query #${updateData.querycode}.`,
            entityType: "packageAssign",
            entityId: Number(userid),
            ipAddress,
            userAgent,
        });







        return {
            status : 200,
            data : updateData
        }
    }



    async getDoctorList(clinicid: string) {
        const getData = await this.prisma.doctor.findMany({
            where : {
                clinicuuid : clinicid
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


     async assignDoctorToQuery(doctorid: string, queryid: string,userid:string) {

        const prevPatientQuery = await this.prisma.patientQuery.findFirst({where:{id : queryid},include:{doctor:true}});

        const updateData = await this.prisma.patientQuery.update({
            where :{
                id : queryid
            },
            data :{
                doctorid : doctorid
            },
            include:{
                doctor : true
            }
        });


        const ipAddress = "0.0.0.0";
        const userAgent = "any browser";
        await this.activityLogService.createLog({
            userId: Number(userid),
            action: `Patient Query Doctor Added/Updated - #${updateData.querycode}`,
            description: prevPatientQuery?.doctor?.firstname ? `The coordinator has updated the doctor from Dr. ${prevPatientQuery.doctor.firstname} - (${prevPatientQuery.doctor.crm}) to Dr. ${updateData.doctor?.firstname || "N/A"} - (${prevPatientQuery.doctor.crm}) for patient query #${updateData.querycode}.`: `The coordinator has added the doctor Dr. ${updateData.doctor?.firstname || "N/A"} - (${updateData.doctor?.crm}) for patient query #${updateData.querycode}.`,
            entityType: "doctorAssign",
            entityId: Number(userid),
            ipAddress,
            userAgent,
        });




        return {
            status : 200,
            data : updateData
        }
    }


    async assignQueryToClinic(patientqueryid: string, status: string, userid: string) {

        const update = await this.prisma.patientQuery.update({
            where: {
                id: patientqueryid
            },
            data: {
                status: Number(status)
            },
            include:{
                clinic : true
            }
        });



        const  patientqueryurl= this.urlGenerator.urls.clinic_request_details(update.id);
        const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: update.clinicId! }, include: { clinicUser: true } });
        let payload: WebhookNotificationDto = {
            page : patientqueryurl,
            title: `The New Request Received To Clinic - ${clinicdetails?.name}`,
            area: "",
            id: clinicdetails?.clinicUserUuid!,
            message: `${clinicdetails?.name} has received a new request ${update.querycode} from ${process.env.NEXT_PUBLIC_PROJECT_NAME}. Please review the request and contact the coordinator.`
        }
        await this.universalNotification.HandleNotification(payload);

        const adminemail = await this.prisma.user.findFirst({ where: { role: { name: "SuperAdmin" } }, select: { email: true } });
        const emailText = `${clinicdetails?.name} has received a new request  ${update.querycode} from ${process.env.NEXT_PUBLIC_PROJECT_NAME}. Please review the request and contact the coordinator.`;
        const htmlContent = EmailTemplate.getTemplate(emailText);
        await this.emailservice.sendEmail(
            clinicdetails?.email!,
            `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The New Request Received To Clinic - ${clinicdetails?.name}`,
            "",
            htmlContent
        );


        const ipAddress = "0.0.0.0";
        const userAgent = "any browser";
        await this.activityLogService.createLog({
            userId: Number(userid),
            action: `The coordinator has sent patient query #${update.querycode} to clinic ${update.clinic?.name}.`,
            description: `The coordinator has discussed the case with the patient and the clinic, and has sent patient query #${update.querycode} to ${update.clinic?.name}.`,
            entityType: "clinicAssign",
            entityId: Number(userid),
            ipAddress,
            userAgent,
        });








        return {
            status: 200,
            data: update
        }
    }



    async getAllCordinator() {
        const allCordinator = await this.prisma.user.findMany({
            where: {
                role: {
                name: "Cordinator"
                }
            }
        });

        return{
            data : allCordinator,
            status : 200
        }
    }
    


    async assignAdminCordinator(cordinatorid: string, patientqueryid: string,userid:string) {

        const assign = await this.prisma.patientQuery.update({
            where: {
                id: patientqueryid
            },
            data: {
                cordinatorid: Number(cordinatorid)
            },
            include:{
                User: true
            }
        });

        const cordinatordetails = await this.prisma.user.findFirst({ where: { id: Number(cordinatorid) } });
        const  patientqueryurl= this.urlGenerator.urls.admin_patient_query_details(assign.id);
        let payload: WebhookNotificationDto = {
            page : patientqueryurl,
            title: `The New Request Received - ${assign.querycode}`,
            area: "",
            id: String(cordinatordetails?.id)!,
            message: `The New request assigned admin to you please go throught the query - ${assign.querycode}`
        }
        await this.universalNotification.HandleNotification(payload);

        const emailText = `The New request assigned admin to you please go throught the query - ${assign.querycode}`;
        const htmlContent = EmailTemplate.getTemplate(emailText);
        await this.emailservice.sendEmail(
            cordinatordetails?.email!,
            `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The New Request Received - ${assign.querycode}`,
            "",
            htmlContent
        );


        const ipAddress= "0.0.0.0";
        const userAgent= "any browser";
        await this.activityLogService.createLog({
            userId : Number(userid),
            action: `Cordinator Changed - #${assign.querycode}`,
            description: `The ${assign.User?.firstname} ${assign.User?.lastname} (${assign.User?.email}) has been assigned to patient query code ${assign.querycode}`,
            entityType: "specialtyPages",
            entityId: Number(assign.id),
            ipAddress,
            userAgent,
        });

        
        return {
            status: 200,
            data : assign
        }
    }



    async deletepaymentDetails(id: string) {
       const  deletData =   await this.prisma.patientQueryPaymentDetails.delete({
            where:{
                id : id
            }
        });
        return{
            status : true,
            data : deletData
        }
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
              clinic: {
                include : {
                    clinicUser : true
                }
              }
            }
          });
        }
    
    
    
          let labeltext = getStatusLabel(Number(status));
    
           const  patientqueryurl= this.urlGenerator.urls.clinic_request_details(updatedata.id);
           let payload: WebhookNotificationDto = {
                    page : patientqueryurl,
                            title: `The admin/coordinator query #${updatedata.querycode} has been set  ${labeltext} to the clinic ${updatedata.clinic?.name}.`,
                            area: "",
                            id : updatedata.clinic.clinicUserUuid!,
                            message: `The admin/coordinator query #${updatedata.querycode} has been ${labeltext} to the clinic ${updatedata.clinic?.name}. Reason: ${updatedata.reason}.`,
                    };
            await this.universalNotification.HandleNotification(payload);
            const htmlContentAdmin = EmailTemplate.getTemplate(``);
             await this.emailservice.sendEmail(
                        updatedata.clinic.clinicUser.email,
                       `${process.env.NEXT_PUBLIC_PROJECT_NAME} - The admin/coordinator query #${updatedata.querycode} has been set ${labeltext} to the clinic ${updatedata.clinic?.name}`,
                       `The admin/coordinator query #${updatedata.querycode} has been ${labeltext} to clinic ${updatedata.clinic?.name}. Reason: ${updatedata.reason}.`,
                       htmlContentAdmin
               );
    
              
    
    
    
        return{
          status : 200,
          data : updatedata
        }
    
    
      }



      async updatePatientQueryFinalPriceStatus(id: string, status: string) {
            

       



        const updateddata= await this.prisma.patientQueryFinalPrice.update({
            where:{
                id : id
            },
            data:{
                status : Number(status)
            },
            include:{
                PatientQuery : true,
                Clinic : {
                    include : {
                        clinicUser : true
                    }
                }
            }
        });

        const patientquery =   await this.prisma.patientQuery.update({
            where:{
                id : updateddata.patientQueryId
            },
            data : {
                finalPrice : String(updateddata.finalPrice)
            }
        });

        


                const  patientqueryurl= this.urlGenerator.urls.clinic_request_details(updateddata.id);
                const payload: WebhookNotificationDto = {
                    page : patientqueryurl,
                    title: `Final price accepted by admin for query #${updateddata.PatientQuery.querycode}`,
                    area: "",
                    id: updateddata.Clinic?.clinicUserUuid!,
                    message: `The final price has been accepted by the admin for query #${updateddata.PatientQuery.querycode}. Please review the query details.`
                };

                await this.universalNotification.HandleNotification(payload);


                const htmlContentAdmin = EmailTemplate.getTemplate(``);
                await this.emailservice.sendEmail(
                            updateddata.Clinic?.clinicUser?.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - The Final Price accepted by admin for #${updateddata.PatientQuery.querycode}`,
                        `The final price has been accepted by the admin for query #${updateddata.PatientQuery.querycode}. Please review the query details.`,
                        htmlContentAdmin
                );











        return{
            data : updateddata,
            patientQuery : patientquery

        }
      }



}