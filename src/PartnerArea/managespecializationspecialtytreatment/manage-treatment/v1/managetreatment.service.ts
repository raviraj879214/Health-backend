import { Injectable } from "@nestjs/common";
import { IManageClinicTreatment } from "../interace/managetreatment.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicTreatmentUpdateDto } from "./dto/managetreatment.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";


@Injectable()
export class ManageClinicTreatmentServices implements IManageClinicTreatment{

    constructor(private readonly prisma:PrismaService,
      private readonly universalNotification:UniversalNotification,
                                private emailservice : EmailService
    ){}



     async getTreatments() {
                        
                        const getData = await this.prisma.treatment.findMany({});
                        
            
                        return {
                            status : 200,
                            data : getData
                        }
                    }
            
            
                    async getClinicTreatments(clinicuuid:string) {
            
                       
            
                        const getData = await this.prisma.clinicTreatment.findMany({
                                where :{
                                    clinicUuid : clinicuuid
                                },
                                include :{
                                    treatment : true,
                                    suggestedCategory : true
                                },
                                
                            
                        });
            
                         return {
                            status : 200,
                            data : getData
                        }
            
                    }
            
            
            
                     async selectTreatment(dto:ClinicTreatmentUpdateDto) {
                    
                            const createData = await this.prisma.clinicTreatment.create({
                                data :{
                                    clinicUuid : dto.clinicUuid!,
                                    treatmentid : dto.treatmentid
                                }
                            });
            
                            return {
                              status : 201,
                              message : "Specilization selected successfully"
                            }
                        }
            
            
                         async deleteTreatments(dto: ClinicTreatmentUpdateDto) {
                                  const deleted = await this.prisma.clinicTreatment.delete({
                                    where: {
                                     id : dto.id
                                    },
                                  });
                        
                                  return {
                                    status: 200,
                                    message: "Delete successfully",
                                  };
                            }
            
            
            
            
                            async createOther(dto: ClinicTreatmentUpdateDto) {
                                        console.log("etstse",dto);
                                    
                                      const newRequest = await this.prisma.specializationRequest.create({
                                        data: {
                                          name: String(dto.othertext),
                                          type: SuggestedType.Treatment,
                                          status: SuggestedCategoryStatus.Pending,
                                        },
                                      });
                            
                                     
                                     const doctorSpecialization = await this.prisma.clinicTreatment.create({
                                        data: {
                                          suggestedCategoryId: newRequest.id,
                                          clinicUuid: dto.clinicUuid!,
                                        }
                                      });



                                       const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: dto.clinicUuid },});
                                        let payload: WebhookNotificationDto = {
                                          title: `New Treatment Request - ${dto.othertext}`,
                                          area: "admin",
                                          message: `${clinicdetails?.name} has submitted a request to add a new treatment reqeuest. Kindly review and proceed with the appropriate action.`
                                        }
                      
                                        const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
                                        console.log("adminemail?.email",adminemail?.email);
                                        await this.universalNotification.HandleNotification(payload);
                                        const emailText = `${clinicdetails?.name} has submitted a request to add a new Treatment. Kindly review and proceed with the appropriate action.<br/><br/>`;
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