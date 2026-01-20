import { Injectable } from "@nestjs/common";
import { IPackageStepFiveServices } from "../interface/packagestepfive.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PackageStepFiveUpdateDto } from "./dto/packagestepfive.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";











@Injectable()
export class ManagePackageProcedureServices implements IPackageStepFiveServices {

    constructor(private readonly prisma: PrismaService,
         private readonly universalNotification:UniversalNotification,
                                              private emailservice : EmailService

    ) { }



    async getProcedure() {

        const getData = await this.prisma.procedure.findMany({});


        return {
            status: 200,
            data: getData
        }
    }


    async getPackageProcedure(packageid:string) {



        const getData = await this.prisma.packageProcedure.findMany({
            where: {
                packageId: packageid
            },
            include: {
                procedure: true,
                suggestedCategory: true
            },


        });

        return {
            status: 200,
            data: getData
        }

    }


    async selectProcedure(dto: PackageStepFiveUpdateDto) {

        const createData = await this.prisma.packageProcedure.create({
            data: {
                packageId: dto.packageid!,
                procedureid : dto.procedureid
            }
        });

        return {
            status: 201,
            message: "Specilization selected successfully"
        }
    }


    async deleteProcedure(dto: PackageStepFiveUpdateDto) {
        const deleted = await this.prisma.packageProcedure.delete({
            where: {
                id: dto.packageid
            },
        });

        return {
            status: 200,
            message: "Delete successfully",
        };
    }




    async createOther(dto: PackageStepFiveUpdateDto) {
       

        const newRequest = await this.prisma.specializationRequest.create({
            data: {
                name: String(dto.othertext),
                type: SuggestedType.Procedure,
                status: SuggestedCategoryStatus.Pending,
            },
        });



        const doctorSpecialization = await this.prisma.packageProcedure.create({
            data: {
                suggestedCategoryId: newRequest.id,
                packageId: dto.packageid!,
            }
        });


                    const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: dto.clinicuuid }, });
                    const packagdetails = await this.prisma.clinicPackage.findUnique({ where: { id: dto.packageid } });
                    const adminemail = await this.prisma.user.findFirst({ where: { role: { name: "SuperAdmin" } }, select: { email: true } });
                    let payload: WebhookNotificationDto = {
                      title: `New Procedure Request for Clinic Package - ${dto.othertext}`,
                      area: "admin",
                      message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has requested for new Procedure ${dto.othertext} for package ${packagdetails?.title} please make an appropriate action`
                    }
                
                    
                    await this.universalNotification.HandleNotification(payload);
                
                
                   const emailText = `Hi Admin, <br/>Clinic: <b>${clinicdetails?.name ?? 'Unknown clinic'}</b> has requested for new Procedure <b> ${dto.othertext}</b> for package <b>${packagdetails?.title}</b> please make an appropriate action<br/>`;
                    const htmlContent = EmailTemplate.getTemplate(emailText);
                    await this.emailservice.sendEmail(adminemail?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | New Procedure Request for Clinic Package - ${dto.othertext}`, "", htmlContent);
                







        return {
            status: 200,
            data: doctorSpecialization,
            message: "Your submission has been created successfully and is pending admin approval.",
        };
    }




}