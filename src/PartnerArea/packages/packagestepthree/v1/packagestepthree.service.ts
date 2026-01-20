import { Injectable } from "@nestjs/common";
import { IPackageStepThree } from "../interface/packagestepthree.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PackageSpecialityUpdateDto } from "./dto/packagestepthree.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";





@Injectable()
export class ManagePackageSpecialtyServices implements IPackageStepThree{

    constructor(private readonly prisma:PrismaService,
       private readonly universalNotification:UniversalNotification,
                              private emailservice : EmailService
    ){}


           async getSpecialitys() {
                    
                    const getData = await this.prisma.specialty.findMany({});
                    
        
                    return {
                        status : 200,
                        data : getData
                    }
                }
        
        
                async getPackageSpecialitys(packageId:string) {
        
                   
        
                    const getData = await this.prisma.packageSpecialty.findMany({
                            where :{
                                packageid : packageId
                            },
                            include :{
                                specialty : true,
                                suggestedCategory : true
                            },
                    });
        
                     return {
                        status : 200,
                        data : getData
                    }
                }
        
        
        
                 async selectSpeciality(dto:PackageSpecialityUpdateDto) {
                
                        const createData = await this.prisma.packageSpecialty.create({
                            data :{
                                packageid : dto.packageId!,
                                specialtyId : dto.specialtyId
                            }
                        });
        
                        return {
                          status : 201,
                          message : "Specilization selected successfully"
                        }
                    }
        
        
                     async deleteSpecilaity(dto: PackageSpecialityUpdateDto) {
                              const deleted = await this.prisma.packageSpecialty.delete({
                                where: {
                                 id : dto.packageId
                                },
                              });
                    
                              return {
                                status: 200,
                                message: "Delete successfully",
                              };
                        }
        

        
        
        
  async createOther(dto: PackageSpecialityUpdateDto) {
    console.log("etstse", dto);

    const newRequest = await this.prisma.specializationRequest.create({
      data: {
        name: String(dto.othertext),
        type: SuggestedType.Specialty,
        status: SuggestedCategoryStatus.Pending,
      },
    });


    const doctorSpecialization = await this.prisma.packageSpecialty.create({
      data: {
        suggestedCategoryId: newRequest.id,
        packageid: dto.packageId!,
      }
    });


    const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: dto.clinicuuid }, });
    const packagdetails = await this.prisma.clinicPackage.findUnique({ where: { id: dto.packageId } });
    const adminemail = await this.prisma.user.findFirst({ where: { role: { name: "SuperAdmin" } }, select: { email: true } });
    let payload: WebhookNotificationDto = {
      title: `New Sub-Specialty Request for Clinic Package - ${dto.othertext}`,
      area: "admin",
      message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has requested for new Sub-specialty ${dto.othertext} for package ${packagdetails?.title} please make an appropriate action`
    }

    
    await this.universalNotification.HandleNotification(payload);


    const emailText = `Hi Admin, <br/>Clinic: <b>${clinicdetails?.name ?? 'Unknown clinic'}</b> has requested for new Sub-specialty <b> ${dto.othertext}</b> for package <b>${packagdetails?.title}</b> please make an appropriate action<br/>`
    const htmlContent = EmailTemplate.getTemplate(emailText);
    await this.emailservice.sendEmail(adminemail?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | New Sub-Specialty Request for Clinic Package - ${dto.othertext}`, "", htmlContent);









    return {
      status: 200,
      data: doctorSpecialization,
      message: "Your submission has been created successfully and is pending admin approval.",
    };
  }

}