import { Injectable } from "@nestjs/common";
import { IManageClinicSpecialty } from "../interface/managespecialty.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ClinicSpecialityUpdateDto } from "./dto/managespecialty.update.dto";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";






@Injectable()
export class ManageSpecialtyServices implements IManageClinicSpecialty{

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
        
        
                async getClinicSpecialitys(clinicuuid:string) {
        
                   
        
                    const getData = await this.prisma.clinicSpecialty.findMany({
                            where :{
                                clinicUuid : clinicuuid
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
        
        
        
                 async selectSpeciality(dto:ClinicSpecialityUpdateDto) {
                
                        const createData = await this.prisma.clinicSpecialty.create({
                            data :{
                                clinicUuid : dto.clinicUuid!,
                                specialtyId : dto.specialtyId
                            }
                        });
        
                        return {
                          status : 201,
                          message : "Specilization selected successfully"
                        }
                    }
        
        
                     async deleteSpecilaity(dto: ClinicSpecialityUpdateDto) {
                              const deleted = await this.prisma.clinicSpecialty.delete({
                                where: {
                                 id : dto.id
                                },
                              });
                    
                              return {
                                status: 200,
                                message: "Delete successfully",
                              };
                        }
        
        
        
        
                        async createOther(dto: ClinicSpecialityUpdateDto) {
                                    console.log("etstse",dto);
                                
                                  const newRequest = await this.prisma.specializationRequest.create({
                                    data: {
                                      name: String(dto.othertext),
                                      type: SuggestedType.Specialty,
                                      status: SuggestedCategoryStatus.Pending,
                                    },
                                  });
                        
                                 
                                 const doctorSpecialization = await this.prisma.clinicSpecialty.create({
                                    data: {
                                      suggestedCategoryId: newRequest.id,
                                      clinicUuid: dto.clinicUuid!,
                                    }
                                  });


                                                    const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: dto.clinicUuid },});
                                                    let payload: WebhookNotificationDto = {
                                                      title: `New Sub-Specialty Request - ${dto.othertext}`,
                                                      area: "admin",
                                                      message: `${clinicdetails?.name} has submitted a request to add a new Sub-specialty. Kindly review and proceed with the appropriate action.`
                                                    }
                                  
                                                    const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
                                                    console.log("adminemail?.email",adminemail?.email);
                                                    await this.universalNotification.HandleNotification(payload);
                                                    const emailText = `${clinicdetails?.name} has submitted a request to add a new Sub-specialty. Kindly review and proceed with the appropriate action.<br/><br/>`;
                                                    const htmlContent = EmailTemplate.getTemplate(emailText);
                                                    await this.emailservice.sendEmail(
                                                            adminemail?.email!,
                                                            `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `New Sub-Specialty Request - ${dto.othertext}`,  
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