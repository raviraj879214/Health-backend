import { Injectable } from "@nestjs/common";
import { IPackageStepFourServices } from "../interface/packagestepfour.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { PackageTreatmentUpdateDto } from "./dto/packagestepfour.update.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";





@Injectable()
export class ManagePackageTreatmentServices implements IPackageStepFourServices {

    constructor(private readonly prisma: PrismaService,
         private readonly universalNotification:UniversalNotification,
                                      private emailservice : EmailService
    ) { }



    async getTreatments() {

        const getData = await this.prisma.treatment.findMany({});


        return {
            status: 200,
            data: getData
        }
    }


    async getPackageTreatments(packageid:string) {



        const getData = await this.prisma.packageTreatment.findMany({
            where: {
                packageId: packageid
            },
            include: {
                treatment: true,
                suggestedCategory: true
            },


        });

        return {
            status: 200,
            data: getData
        }

    }



    async selectTreatment(dto: PackageTreatmentUpdateDto) {

        const createData = await this.prisma.packageTreatment.create({
            data: {
                packageId: dto.packageid!,
                treatmentid : dto.treatmentid
            }
        });

        return {
            status: 201,
            message: "Specilization selected successfully"
        }
    }


    async deleteTreatments(dto: PackageTreatmentUpdateDto) {
        const deleted = await this.prisma.packageTreatment.delete({
            where: {
                id: dto.packageid
            },
        });

        return {
            status: 200,
            message: "Delete successfully",
        };
    }




    async createOther(dto: PackageTreatmentUpdateDto) {
       

        const newRequest = await this.prisma.specializationRequest.create({
            data: {
                name: String(dto.othertext),
                type: SuggestedType.Treatment,
                status: SuggestedCategoryStatus.Pending,
            },
        });


       



        const doctorSpecialization = await this.prisma.packageTreatment.create({
            data: {
                suggestedCategoryId: newRequest.id,
                packageId: dto.packageid!,
            }
        });


        const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: dto.clinicuuid }, });
            const packagdetails = await this.prisma.clinicPackage.findUnique({ where: { id: dto.packageid } });
            const adminemail = await this.prisma.user.findFirst({ where: { role: { name: "SuperAdmin" } }, select: { email: true } });
            let payload: WebhookNotificationDto = {
              title: `New Treatment Request for Clinic Package - ${dto.othertext}`,
              area: "admin",
              message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has requested for new Treatment ${dto.othertext} for package ${packagdetails?.title} please make an appropriate action`
            }
        
            
            await this.universalNotification.HandleNotification(payload);
        
        
            const emailText = `Hi Admin, <br/>Clinic: <b>${clinicdetails?.name ?? 'Unknown clinic'}</b> has requested for new Treatment <b> ${dto.othertext}</b> for package <b>${packagdetails?.title}</b> please make an appropriate action<br/>`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(adminemail?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | New Treatment Request for Clinic Package - ${dto.othertext}`, "", htmlContent);
        

        return {
            status: 200,
            data: doctorSpecialization,
            message: "Your submission has been created successfully and is pending admin approval.",
        };
    }






}