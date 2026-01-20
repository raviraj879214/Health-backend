import { Injectable } from "@nestjs/common";
import { IDoctorSpecialty } from "../interface/doctorspecialty.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SuggestedType } from "src/common/enum/SuggestedCategoryType";
import { SuggestedCategoryStatus } from "src/common/enum/SuggestedCategoryStatus";
import { DoctorSpecialtyUpdateDto } from "./dto/doctorspecialty.update.dto";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";







@Injectable()
export class DoctorSpecilatyService implements IDoctorSpecialty {

  constructor(
    private readonly prisma: PrismaService,
    private readonly universalNotification:UniversalNotification,
    private emailservice : EmailService
  ) { }


  async getSpecialty() {
    const getData = await this.prisma.specialty.findMany({});

    return {
      status: 200,
      message: "Specialty fetched successfully",
      data: getData
    }
  }

  async selectedSpecialty(doctoruuid: any) {

    const getData = await this.prisma.doctorSpecialty.findMany({
      where: {
        doctorUuid: doctoruuid
      },
      include: {
        specialty: {
          select: {
            name: true,
            id: true
          }
        },
        suggestedCategory: {
          where: {
            type: SuggestedType.Specialty,
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

  async removeSpecialty(id: string) {

    const remove = await this.prisma.doctorSpecialty.delete({
      where: {
        id: id
      }
    });

    return {
      status: 200,
      message: "Removed successfully"
    }
  }

  async deleteSpecialty(dto: DoctorSpecialtyUpdateDto) {
    const deleted = await this.prisma.doctorSpecialty.delete({
      where: {
        doctorUuid_specialtyId: {
          doctorUuid: dto.doctorUuid,
          specialtyId: dto.id,
        },
      },
    });

    return {
      status: 200,
      message: "Delete successfully",
    };
  }



  async selectSpecialty(dto: DoctorSpecialtyUpdateDto) {

    const createData = await this.prisma.doctorSpecialty.create({
      data: {
        doctorUuid: dto.doctorUuid,
        specialtyId: dto.specialtyId
      }
    });

    return {
      status: 201,
      message: "Specilization selected successfully"
    }

  }


   async createOther(dto: DoctorSpecialtyUpdateDto) {
          
            debugger;
            const newRequest = await this.prisma.specializationRequest.create({
              data: {
                name: String(dto.othertext),
                type: SuggestedType.Specialty,
                status: SuggestedCategoryStatus.Pending,
              },
            });
  
           
           const doctorSpecialization = await this.prisma.doctorSpecialty.create({
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
                                  title : `New Sub-specialty Request - ${dto.othertext}`,
                                  area: "admin",
                                 message: `${clinicdetails?.name} has submitted a request to add a new sub-specialty for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. Kindly review and proceed with the appropriate action.`
                      }
  
                       await this.universalNotification.HandleNotification(payload);

                       const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
                        console.log("adminemail?.email",adminemail?.email);
                        await this.universalNotification.HandleNotification(payload);
                        const emailText = `${clinicdetails?.name} has submitted a request to add a new sub-specialty for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. Kindly review and proceed with the appropriate action.`
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
