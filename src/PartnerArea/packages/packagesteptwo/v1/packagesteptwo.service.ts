import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IManagePackageSpecialization } from "../interface/packagesteptwo.interface";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { PackageSpecializationUpdateDto } from "./dto/packagesteptwo.update.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";




@Injectable()
export class ManagePackageSpecializationsServices implements IManagePackageSpecialization{

        constructor(private readonly prisma:PrismaService,
          private readonly universalNotification:UniversalNotification,
                        private emailservice : EmailService
        ){}


        async getSpecializations() {
            
            const getData = await this.prisma.specialization.findMany({});
            

            return {
                status : 200,
                data : getData
            }
        }


        async getPackageSpecializations(packageid:string) {

            console.log("packageid",packageid);

            const getData = await this.prisma.packageSpecialization.findMany({
                    where :{
                        packageId : packageid
                    },
                    include :{
                        specialization : true,
                        suggestedCategory : true
                    },
            });

            

             return {
                status : 200,
                data : getData
            }

        }



         async selectSpecialization(dto:PackageSpecializationUpdateDto) {
        
                const createData = await this.prisma.packageSpecialization.create({
                    data :{
                        packageId : dto.packageId,
                        specializationId : dto.specializationId
                    }
                });

                return {
                  status : 201,
                  message : "Specilization selected successfully"
                }
            }


             async deleteSpecilaization(dto: PackageSpecializationUpdateDto) {
                      const deleted = await this.prisma.packageSpecialization.delete({
                        where: {
                         id : dto.packageId
                        },
                      });
            
                      return {
                        status: 200,
                        message: "Delete successfully",
                      };
                }




                async createOther(dto: PackageSpecializationUpdateDto) {
                            
                        
                          const newRequest = await this.prisma.specializationRequest.create({
                            data: {
                              name: String(dto.othertext),
                              type: SuggestedType.Specialization,
                              status: SuggestedCategoryStatus.Pending,
                            },
                          });
                
                         
                         const doctorSpecialization = await this.prisma.packageSpecialization.create({
                            data: {
                              suggestedCategoryId: newRequest.id,
                              packageId: dto.packageId!,
                            }
                          });


                                const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: dto.clinicuuid },});
                                const packagdetails = await this.prisma.clinicPackage.findUnique({where:{id : dto.packageId}});
                                const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
                                let payload : WebhookNotificationDto ={
                                    title : `New Specialty Request for Clinic Package - ${dto.othertext}`,
                                    area: "admin",
                                    message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has requested for new specialty ${dto.othertext} for package ${packagdetails?.title} please make an appropriate action`
                                }
                                await this.universalNotification.HandleNotification(payload);

                                const emailText =  `Hi Admin, <br/>Clinic: <b>${clinicdetails?.name ?? 'Unknown clinic'}</b> has requested for new specialty <b> ${dto.othertext}</b> for package <b>${packagdetails?.title}</b> please make an appropriate action<br/>`;
                                const htmlContent = EmailTemplate.getTemplate(emailText);
                                await this.emailservice.sendEmail(adminemail?.email!,`${process.env.NEXT_PUBLIC_PROJECT_NAME} | New Specialty Request for Clinic Package - ${dto.othertext}`,  "",htmlContent);
  



                          return {
                            status: 200,
                            data: doctorSpecialization,
                            message: "Your submission has been created successfully and is pending admin approval.",
                          };
                 }
                


}