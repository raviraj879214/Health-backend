import { Injectable } from "@nestjs/common";
import { IDoctorTreatment } from "../interface/doctortreatment.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { DoctorTreatmentDtoUpdate } from "./dto/doctortreatment.update.dto";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";





@Injectable()
export class DoctorTreatmentService implements IDoctorTreatment{


    constructor(
      private readonly prisma:PrismaService,
      private readonly universalNotification:UniversalNotification,
          private emailservice : EmailService


    ){}


      async getTreatment() {
        const getData = await this.prisma.treatment.findMany({});
    
        return {
          status: 200,
          message: "Treatment fetched successfully",
          data: getData
        }
      }
    
      async selectedTreatment(doctoruuid: any) {
    
        const getData = await this.prisma.doctorTreatment.findMany({
          where: {
            doctorUuid: doctoruuid
          },
          include: {
            treatment: {
              select: {
                name: true,
                id: true
              }
            },
            suggestedCategory: {
              where: {
                type: SuggestedType.Treatment,
                status: SuggestedCategoryStatus.Pending
              },
              select: {
                name: true,
                id: true
              }
            }
          }
        });
    
    
        return {
          status: 200,
          message: "",
          data: getData
        }
      }
    
      async removeTreatment(id: string) {
    
        const remove = await this.prisma.doctorTreatment.delete({
          where: {
            id: id
          }
        });
    
        return {
          status: 200,
          message: "Removed successfully"
        }
      }
    
      async deleteTreatment(dto: DoctorTreatmentDtoUpdate) {
        const deleted = await this.prisma.doctorTreatment.delete({
          where: {
            doctorUuid_treatmentid: {
              doctorUuid: dto.doctorUuid,
              treatmentid: dto.id,
            },
          },
        });
    
        return {
          status: 200,
          message: "Delete successfully",
        };
      }
    
    
    
      async selectTreatment(dto: DoctorTreatmentDtoUpdate) {
    
        const createData = await this.prisma.doctorTreatment.create({
          data: {
            doctorUuid: dto.doctorUuid,
            treatmentid: dto.treatmentid
          }
        });
    
        return {
          status: 201,
          message: "Specilization selected successfully"
        }
    
      }
    
    
       async createOther(dto: DoctorTreatmentDtoUpdate) {
              
                debugger;
                const newRequest = await this.prisma.specializationRequest.create({
                  data: {
                    name: String(dto.othertext),
                    type: SuggestedType.Treatment,
                    status: SuggestedCategoryStatus.Pending,
                  },
                });
      
               
               const doctorSpecialization = await this.prisma.doctorTreatment.create({
                  data: {
      
                    suggestedCategoryId: newRequest.id,
                    doctorUuid: dto.doctorUuid,
                  }
                });


                   const clinicdetails = await this.prisma.clinic.findUnique({
                            where: { uuid: dto.clinicuuid },
                    });

                    const doctordetails =await this.prisma.doctor.findUnique({
                        where : {
                          uuid : dto.doctorUuid
                        }
                      });

                      let payload : WebhookNotificationDto ={
                                                  title : `New Treatment Request - ${dto.othertext}`,
                                                  area: "admin",
                                                 message: `${clinicdetails?.name} has submitted a request to add a new treatment for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. Kindly review and proceed with the appropriate action.`
                       }
                       await this.universalNotification.HandleNotification(payload);


                        const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
                      
                        const emailText = `${clinicdetails?.name} has submitted a request to add a new treatment for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. Kindly review and proceed with the appropriate action.`
                        const htmlContent = EmailTemplate.getTemplate(emailText);
                        await this.emailservice.sendEmail(
                                adminemail?.email!,
                                `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `New Treatment Request - ${dto.othertext}`,  
                                "",            
                                htmlContent  
                        );
                  
      
      
               
                return {
                  status: 200,
                  data: doctorSpecialization,
                  message: "Your submission has been created successfully and is pending admin approval.",
                };
      }
    

    

}