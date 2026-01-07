import { Injectable } from "@nestjs/common";
import { IManageClinic } from "../interface/manageclinic.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { SendMessageCreateDto } from "./dto/manageclinic.update.dto";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { Emailenumconsts } from "src/common/emailtemplate/emailenums";
import { ClinicStatus } from "src/common/enum/ClinicStatus";






@Injectable()
export class ManageClinicServices implements IManageClinic{
    constructor(
        private readonly prisma:PrismaService,
        private emailservice : EmailService,
        private readonly universalNotification:UniversalNotification

    ){}



    async getClinicListing(page: number, limit: number) {
        const totalCount = await this.prisma.clinic.count();

        const getData = await this.prisma.clinic.findMany({
            include:{
                city: true,
                country : true,
                clinicDoctors : {
                    include : {
                        
                        doctor : true
                    }
                }
            },
            orderBy:{
                createdAt : "desc"
            },
            ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
                })

        });



        return{
            status : 200,
            data : getData,
            totalCount
            
        }
    }


    async getClinicDetails(clinicuuid: string) {
            const getData = await this.prisma.clinic.findFirst({
                where : {
                    uuid : clinicuuid
                },
                include:{
                    city:true,
                    country:true
                }
            });
            return {
                status : 200,
                data : getData
            }
    }

    async getClinicBannerImages(clinicuuid: string) {
        const bannerimages = await this.prisma.clinicImages.findMany({
            where :{
                clinicuuid : clinicuuid
            }
        });
        return{
            status : 200,
            data : bannerimages
        }
    }


    async getSurgeryImages(clinicuuid: string) {

        const getData = await this.prisma.clinicSurgeryImage.findMany({
            where :{
                clinicUuid : clinicuuid
            }
        });
        return{
            status : 200,
            data : getData
        }
    }


    async getClinicDescription(clinicuuid: string) {
        const getData = await this.prisma.clinicDescription.findFirst({
            where : {
                clinicuuid : clinicuuid
            }
        });
        return{
            status : 200 ,
            data : getData
        }
    }




    async getClinicSpecialty(clinicuuid: string) {
        
        const getData = await this.prisma.clinicSpecialization.findMany({
            where : {
                clinicUuid : clinicuuid
            },
            include:{
                specialization : true,
                suggestedCategory: true
            }
        });

        return{
            status : 200,
            data : getData
        }
    }

    
    async acceptSpecailty(id: string) {

        const getSuggestedSpecialty =await this.prisma.specializationRequest.findFirst({
            where : {
                id:id
            }
        });

        const createSpecialization = await this.prisma.specialization.create({
            data : {
                name : getSuggestedSpecialty?.name || ""
            }
        });

        const updateSpecialization = await this.prisma.clinicSpecialization.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                specializationId : createSpecialization.id
            }
        });

        return{
            status : 200,
            message : "Category approved successfully"
        }
    }





    async rejectSpecailty(id: string) {


         await this.prisma.clinicSpecialization.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });


       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getSpecialty(clinicuuid: string) {
        const getData = await this.prisma.specialization.findMany({
            include:{
                clinics:{
                    where :{
                        clinicUuid : clinicuuid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignSpecialty(assignid: string, clinicuuid: string) {

        const assign = await this.prisma.clinicSpecialization.create({
            data:{
                specializationId: assignid,
                clinicUuid:clinicuuid
            }
        });

        return{
            status : 201,
            message : "Specialty assigned successfully"
        }
    }

    async unassignSpecialty(unassignid: string, clinicuuid: string) {

        const DeletSpecialty = await this.prisma.clinicSpecialization.deleteMany({
            where : {
                specializationId : unassignid
            }
        });

        return{
            status  : 200,
            message : "Removed successfully"
        }

    }






 async getClinicSubSpecialty(clinicuuid: string) {
        
        const getData = await this.prisma.clinicSpecialty.findMany({
            where : {
                clinicUuid : clinicuuid
            },
            include:{
                specialty : true,
                suggestedCategory: true
            }
        });

        return{
            status : 200,
            data : getData
        }
    }

    
    async acceptSubSpecailty(id: string) {

        const getSuggestedSpecialty =await this.prisma.specializationRequest.findFirst({
            where : {
                id:id
            }
        });

        const createSpecialization = await this.prisma.specialty.create({
            data : {
                name : getSuggestedSpecialty?.name || ""
            }
        });

        const updateSpecialization = await this.prisma.clinicSpecialty.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                specialtyId : createSpecialization.id
            }
        });

        return{
            status : 200,
            message : "Category approved successfully"
        }
    }





    async rejectSubSpecailty(id: string) {


         await this.prisma.clinicSpecialty.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });


       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getSubSpecialty(clinicuuid: string) {
        const getData = await this.prisma.specialty.findMany({
            include:{
                clinicsSpecialty:{
                    where :{
                        clinicUuid : clinicuuid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignSubSpecialty(assignid: string, clinicuuid: string) {

       

        try {
            
             const assign = await this.prisma.clinicSpecialty.create({
            data:{
                specialtyId : assignid,
                clinicUuid:clinicuuid
            }
        });

        return{
            status : 201,
            message : "Specialty assigned successfully"
        }


        } catch (error) {
            console.log("error message",error.message);
        }

    }

    async unassignSubSpecialty(unassignid: string, clinicuuid: string) {

        const DeletSpecialty = await this.prisma.clinicSpecialty.deleteMany({
            where : {
                specialtyId : unassignid
            }
        });

        return{
            status  : 200,
            message : "Removed successfully"
        }

    }






    



 async getClinicTreatment(clinicuuid: string) {
        
        const getData = await this.prisma.clinicTreatment.findMany({
            where : {
                clinicUuid : clinicuuid
            },
            include:{
                treatment : true,
                suggestedCategory: true
            }
        });

        return{
            status : 200,
            data : getData
        }
    }

    
    async acceptTreatment(id: string) {

        const getSuggestedSpecialty =await this.prisma.specializationRequest.findFirst({
            where : {
                id:id
            }
        });

        const createSpecialization = await this.prisma.treatment.create({
            data : {
                name : getSuggestedSpecialty?.name || ""
            }
        });

        const updateSpecialization = await this.prisma.clinicTreatment.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                treatmentid : createSpecialization.id
            }
        });

        return{
            status : 200,
            message : "Category approved successfully"
        }
    }





    async rejectTreatment(id: string) {


         await this.prisma.clinicTreatment.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });


       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getTreatment(clinicuuid: string) {
        const getData = await this.prisma.treatment.findMany({
            include:{
                clinicTreatments:{
                    where :{
                        clinicUuid : clinicuuid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignTreatment(assignid: string, clinicuuid: string) {

       

        try {
            
             const assign = await this.prisma.clinicTreatment.create({
            data:{
                treatmentid : assignid,
                clinicUuid:clinicuuid
            }
        });

        return{
            status : 201,
            message : "Specialty assigned successfully"
        }


        } catch (error) {
            console.log("error message",error.message);
        }

    }

    async unassignTreatment(unassignid: string, clinicuuid: string) {

        const DeletSpecialty = await this.prisma.clinicTreatment.deleteMany({
            where : {
                treatmentid : unassignid
            }
        });

        return{
            status  : 200,
            message : "Removed successfully"
        }

    }


    async getClinicPackages(id: string) {
        const getData = await this.prisma.clinicPackage.findMany({
            where : {
                clinicId : id
            },
            include: {
                packagesDoctor : {
                       include :{
                        doctors : true
                       }
                }
            }
        });

        return {
            status : 200,
            data : getData
        }
    }



    async getPackages(page: number, limit: number) {
         const totalCount = await this.prisma.clinicPackage.count();
        const getData = await this.prisma.clinicPackage.findMany({
                include:{
                    boosts : {
                        include:{
                            boostPackage : true
                        
                        }
                    }
                },
            
            ...((page > 0 && limit > 0) &&{
                    skip: (page - 1) * limit,
                    take: limit,
                })
        });

        return{
            status : 200,
            data : getData,
            totalCount
        }
    }



    async getpackagesDetails(id: string) {
        console.log('Incoming package id:', id);

        const getData = await this.prisma.clinicPackage.findFirst({
            where :{
                id : id
            },
            include:{
                boosts :{
                    where : {
                        clinicPackageId : id,
                        isActive :true
                    },
                    include:{
                        boostPackage : true
                    }
                },
                clinic : {
                    include : {
                        city : true,
                        country : true
                    }
                },
                fieldValues :{
                    include : {
                        field : true
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }



    async sendMessageToClinic(dto: SendMessageCreateDto) {

        
        const getClinicDetails = await this.prisma.clinic.findUnique({
            where:{
                uuid : dto.clinicId!
            }
        });

        const bodyexternal = "Hi the clinic" + getClinicDetails?.name;


        if(dto.type === "send_message")
        {
            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
            const emailText = emailTemplate?.body;
            const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
            await this.emailservice.sendEmail(
                    getClinicDetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + emailTemplate?.subject!,  
                    "",            
                    htmlContent  
            );

            let payload : WebhookNotificationDto ={
                title : "New message from admin",
                area: "clinic",
                message : dto.messagetext,
                id : getClinicDetails?.uuid
            }

            await this.universalNotification.HandleNotification(payload);
        }
        else if(dto.type === "send_approve"){
            await this.prisma.clinic.update({
                where :{
                    uuid : getClinicDetails?.uuid
                },
                data:{
                    status : ClinicStatus.ACTIVE,
                    reasonText : dto.messagetext
                }
            });

            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
            const emailText = emailTemplate?.body;
          const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
            await this.emailservice.sendEmail(
                    getClinicDetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + "Admin Approved account Successfully",  
                    "",            
                    htmlContent  
            );

            let payload : WebhookNotificationDto ={
                title : "Admin Approved account Successfully",
                area: "clinic",
                message : dto.messagetext,
                id : getClinicDetails?.uuid
            }
            await this.universalNotification.HandleNotification(payload);
        }
        else if(dto.type === "send_block"){
            await this.prisma.clinic.update({
                where :{
                    uuid : getClinicDetails?.uuid
                },
                data:{
                    status : ClinicStatus.BLOCKED,
                    reasonText : dto.messagetext
                }
            });

            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
            const emailText = emailTemplate?.body;
            const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
            await this.emailservice.sendEmail(
                    getClinicDetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + "Admin Approved account Successfully",  
                    "",            
                    htmlContent  
            );

            let payload : WebhookNotificationDto ={
                title : "Admin Blocked account",
                area: "clinic",
                message : dto.messagetext,
                id : getClinicDetails?.uuid
            }
            await this.universalNotification.HandleNotification(payload);
        }
         else if(dto.type === "send_reject"){
            await this.prisma.clinic.update({
                where :{
                    uuid : getClinicDetails?.uuid
                },
                data:{
                    status : ClinicStatus.REJECTED,
                    reasonText : dto.messagetext
                }
            });

            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
            const emailText = emailTemplate?.body;
            const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
            await this.emailservice.sendEmail(
                    getClinicDetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + "Admin Approved account Successfully",  
                    "",            
                    htmlContent  
            );

            let payload : WebhookNotificationDto ={
                title : "Admin Rejected account",
                area: "clinic",
                message : dto.messagetext,
                id : getClinicDetails?.uuid
            }
            await this.universalNotification.HandleNotification(payload);
        }
        else if(dto.type === "send_unreject"){
            await this.prisma.clinic.update({
                where :{
                    uuid : getClinicDetails?.uuid
                },
                data:{
                    status : ClinicStatus.ACTIVE,
                    reasonText : dto.messagetext
                }
            });

            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
            const emailText = emailTemplate?.body;
            const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
            await this.emailservice.sendEmail(
                    getClinicDetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + "Admin Approved account Successfully",  
                    "",            
                    htmlContent  
            );

            let payload : WebhookNotificationDto ={
                title : "Admin Un-Blocked account Successfully",
                area: "clinic",
                message : dto.messagetext,
                id : getClinicDetails?.uuid
            }
            await this.universalNotification.HandleNotification(payload);
        }
        




        return{
            status : true
        }
    }



    async getAccreditations(clinicuuid: string) {
        const getData =await this.prisma.clinicAccreditation.findMany({
            where :{
                clinicuuid: clinicuuid
            },
            include:{
                accreditation : true
            }
        });



        return{
            status : 200,
            data : getData
        }
    }










}