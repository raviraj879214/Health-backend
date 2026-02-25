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




@Injectable()
export class PatientQueriesServices implements IPatientQueries{
    constructor(private readonly prisma:PrismaService,
         private emailservice : EmailService,
         private readonly universalNotification:UniversalNotification,
         private readonly activityLogService: ActivityLogService
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
                finalPrice : String(dto.finalprice)
            }
        });

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




        const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: update.clinicId! }, include: { clinicUser: true } });
        let payload: WebhookNotificationDto = {
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
        let payload: WebhookNotificationDto = {
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




}