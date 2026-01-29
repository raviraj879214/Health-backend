import { BadRequestException, Injectable } from "@nestjs/common";
import { IPatientQueries } from "../interface/patientqueries.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PatientQueryCreateDto } from "./dto/patientqueries.create.dto";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";




@Injectable()
export class PatientQueriesServices implements IPatientQueries{
    constructor(private readonly prisma:PrismaService,
         private emailservice : EmailService,
         private readonly universalNotification:UniversalNotification
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


    async insertFinalDealPrice(dto: PatientQueryCreateDto) {
        
        const createData = await this.prisma.patientQuery.update({
            where :{
                id : dto.patientqueryid
            },
            data :{
                finalPrice : String(dto.finalprice)
            }
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




    async assignClinicToPatientQuery(clinicid: string, queryid: string) {
        const updateData = await this.prisma.patientQuery.update({
            where :{
                id : queryid
            },
            data :{
                clinicId : clinicid,
                packageId : null,
                doctorid : null
            }
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



    async assignPackageToQuery(packageId: string, queryid: string) {


        const updateData = await this.prisma.patientQuery.update({
            where :{
                id : queryid
            },
            data :{
                packageId : packageId
            }
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


     async assignDoctorToQuery(doctorid: string, queryid: string) {


        const updateData = await this.prisma.patientQuery.update({
            where :{
                id : queryid
            },
            data :{
                doctorid : doctorid
            }
        });
        return {
            status : 200,
            data : updateData
        }
    }


    async  assignQueryToClinic(patientqueryid: string, status: string) {

        const update = await this.prisma.patientQuery.update({
            where:{
                id : patientqueryid
            },
            data :{
                status : Number(status)
            }
        });




                   const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: update.clinicId! },include:{clinicUser:true}});
                    let payload : WebhookNotificationDto ={
                            title : `The New Request Received To Clinic - ${clinicdetails?.name}`,
                            area: "",
                            id : clinicdetails?.clinicUserUuid!,
                            message: `${clinicdetails?.name} has received a new request ${update.querycode} from ${process.env.NEXT_PUBLIC_PROJECT_NAME}. Please review the request and contact the coordinator.`
                    }


                    await this.universalNotification.HandleNotification(payload);
                    
                    const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
                    const emailText = `${clinicdetails?.name} has received a new request  ${update.querycode} from ${process.env.NEXT_PUBLIC_PROJECT_NAME}. Please review the request and contact the coordinator.`;
                    const htmlContent = EmailTemplate.getTemplate(emailText);
                    await this.emailservice.sendEmail(
                            clinicdetails?.email!,
                            `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The New Request Received To Clinic - ${clinicdetails?.name}`,  
                            "",            
                            htmlContent  
                    );







        return{
            status : 200,
            data : update
        }
    }


    





}