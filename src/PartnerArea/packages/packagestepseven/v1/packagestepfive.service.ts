import { Injectable } from "@nestjs/common";
import { IPackageStepFiveServices } from "../interface/packagestepfive.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PackageStepDoctorUpdateDto } from "./dto/packagestepfive.update.dto";
import { PackageVerifyStatus } from "src/common/enum/packageVerifyStatus";
import { PackageVisibiltyStatus } from "src/common/enum/packageVisibiltyStatus";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { DoctorVerifyStatus } from "src/common/enum/doctorVerifyStatus";







@Injectable()
export class ManagePackageDoctorServices implements IPackageStepFiveServices {

    constructor(
        private readonly prisma: PrismaService,
         private readonly universalNotification:UniversalNotification,
                private emailservice : EmailService
    ) { }


    async getSelectedDoctor(packageid: string) {

        const  getData = await this.prisma.packageDoctor.findFirst({
            where :{
                packageId : packageid
            },
            include:{
                doctors : true
            }
        });
        return {
            status : 200,
            data : getData
        }
    }


    async selectDoctor(dto: PackageStepDoctorUpdateDto) {

        const existcheck = await this.prisma.packageDoctor.findFirst({
            where: { packageId: dto.packageId }
        })
        
        if (existcheck) {

            const update = await this.prisma.packageDoctor.update({
                where: {
                    id: existcheck.id,
                },
                data: {
                    doctorId: dto.doctorId
                }
            });
            return {
                status: 200,
                message: "Doctor selected successgully",
                data: update

            }
        }
        else {
            const create = await this.prisma.packageDoctor.create({
                data: {
                    packageId: dto.packageId,
                    doctorId: dto.doctorId
                }
            });

            return {
                status: 200,
                message: "Doctor selected successgully",
                data: create
            }

        }

    }



    async submitPackage(packageid: string) {
        const updateData = await this.prisma.clinicPackage.update({
            where: {
                id: packageid
            },
            data: {
                status: PackageVerifyStatus.PENDING,
                Visibilty: PackageVisibiltyStatus.HIDE
            }
        });




        const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: updateData.clinicId },});
         const packagdetails = await this.prisma.clinicPackage.findUnique({ where: { id: packageid } });
         const adminemail = await this.prisma.user.findFirst({ where: { role: { name: "SuperAdmin" } }, select: { email: true } });
        let payload: WebhookNotificationDto = {
            title: "Package Info Added",
            area: "admin",
            message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} created/updated package successfully,sent for approval please visit clinic and make approval`
        }
        await this.universalNotification.HandleNotification(payload);

        const emailText = `Hi Admin, <br/><br/>  <b>${clinicdetails?.name ?? 'Unknown clinic'}</b> created/updated package successfully,sent for approval please visit clinic and make approval <br/><br/>`
        const htmlContent = EmailTemplate.getTemplate(emailText);
        await this.emailservice.sendEmail(adminemail?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | Package Info Added`, "", htmlContent);



        return {
            status: 200
        }
    }




    async updateVisibilty(packageid: string,status:number) {
        
             const updateData = await this.prisma.clinicPackage.update({
            where:{
                id : packageid
            },
            data:{
                Visibilty : status
            }
        });


                            return{
                                status : 200
                            }
                    }




                     async getDoctors(clinicuuid: string) {
                        
                                    const assignments = await this.prisma.clinicDoctor.findMany({
                                    where: {
                                        clinicUuid: clinicuuid,
                                    },
                                    });
                    
                              
                                    const doctorUuids = assignments.map((a) => a.doctorUuid);
                    
                                 
                                const assignedDoctors = await this.prisma.doctor.findMany({
                                    where: {
                                        uuid: {
                                            in: doctorUuids,
                                        },
                                         OR: [
                                            { DoctorVerify: DoctorVerifyStatus.VERIFIED },
                                        ],
                                    },
                                 });
                    
                    
                             return {
                                status : 200,
                                message : "fetch doctors successfully",
                                data : assignedDoctors
                             }
                        }





}