import { Injectable } from "@nestjs/common";
import { IManagePackage } from "../interface/managepackage.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailService } from "src/EmailServices/email.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { SendMessageCreateDto } from "./dto/managepackage.create.dto";
import { PackageVerifyStatus } from "src/common/enum/packageVerifyStatus";
import { Emailenumconsts } from "src/common/emailtemplate/emailenums";
import { ClinicStatus } from "src/common/enum/ClinicStatus";








@Injectable()
export class ManagePackageServices implements IManagePackage{

    constructor(private readonly prisma:PrismaService,
         private emailservice : EmailService,
                private readonly universalNotification:UniversalNotification
    ){}



     async getSpecialty(packageid: string) {
            const getData = await this.prisma.specialization.findMany({
                include:{
                    packagesSpecialization:{
                        where :{
                            packageId : packageid
                        }
                    }
                }
            });
    
            return{
                status : 200,
                data : getData
            }
        }

      async getPackageSpecialty(packageid: string) {
            
            const getData = await this.prisma.packageSpecialization.findMany({
                where : {
                    packageId : packageid
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
    


        
        async acceptSpecailty(id: string, packageid: string) {
    
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
    
            const updateSpecialization = await this.prisma.packageSpecialization.updateMany({
                where : {
                    suggestedCategoryId : getSuggestedSpecialty?.id 
                },
                data :{
                    suggestedCategoryId : null,
                    specializationId : createSpecialization.id
                }
            });
    
               const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:{include:{clinicUser : true}}}});

                let payload : WebhookNotificationDto ={
                        title : `The Specialty Request Accepted - ${getSuggestedSpecialty?.name}`,
                        area: "",
                        id : clinicdetails?.clinic.clinicUserUuid!,
                        message: `${clinicdetails?.clinic.name} has submitted a request  has been accepted for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
                }
                await this.universalNotification.HandleNotification(payload);
                const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
                const emailText = `${clinicdetails?.clinic.name} has submitted a request has been accepted for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
                const htmlContent = EmailTemplate.getTemplate(emailText);
                await this.emailservice.sendEmail(
                        clinicdetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Specialty Request Accepted - ${getSuggestedSpecialty?.name}`,  
                        "",            
                        htmlContent  
                );
    
    
    
            return{
                status : 200,
                message : "Category approved successfully"
            }
        }
    
    
    
    
    
        async rejectSpecailty(id: string, packageid: string) {
    
            const assign = await this.prisma.specializationRequest.findFirst({where:{id:id}});
             await this.prisma.packageSpecialization.deleteMany({
                where :{
                    suggestedCategoryId : id
                }
            });
            
    
            const deleteSuggested = await this.prisma.specializationRequest.delete({
                where :{
                    id : id
                }
            });
    
    
    
    
    
              const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:{include:{clinicUser : true}}}});
                let payload : WebhookNotificationDto ={
                        title : `The Specialty Request Rejected - ${assign?.name}`,
                        area: "",
                        id : clinicdetails?.clinic.clinicUserUuid!,
                        message: `${clinicdetails?.clinic.name} has submitted a request has been rejected for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
                }
                await this.universalNotification.HandleNotification(payload);
                const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
                const emailText = `${clinicdetails?.clinic.name} has submitted a request has been rejected for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
                const htmlContent = EmailTemplate.getTemplate(emailText);
                await this.emailservice.sendEmail(
                        clinicdetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Specialty Request rejected - ${assign?.name}`,  
                        "",            
                        htmlContent  
                );
    
    
           
    
    
    
    
            return{
                status : 200,
                message : "Deleted successfully"
            }
            
        }
    
    
       
    
    
        async assignSpecialty(assignid: string, packageid: string) {
    
            const assign = await this.prisma.packageSpecialization.create({
                data:{
                    specializationId: assignid,
                    packageId:packageid
                },
                include:{
                    specialization : true
                }
            });
    
    
    
    
             const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:{include:{clinicUser : true}}}});
                let payload : WebhookNotificationDto ={
                        title : `The Specialty assigned - ${assign?.specialization?.name}`,
                        area: "",
                        id : clinicdetails?.clinic.clinicUserUuid!,
                        message: `Admin has assigned  ${assign?.specialization?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
                }
                await this.universalNotification.HandleNotification(payload);
                const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
                const emailText = `Admin has assigned  ${assign?.specialization?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
                const htmlContent = EmailTemplate.getTemplate(emailText);
                await this.emailservice.sendEmail(
                        clinicdetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Specialty Assigned - ${assign?.specialization?.name}`,  
                        "",            
                        htmlContent  
                );
    
    
            return{
                status : 201,
                message : "Specialty assigned successfully"
            }
        }
    
        async unassignSpecialty(unassignid: string, packageid: string) {
    
            const assign = await this.prisma.packageSpecialization.findFirst({where:{specializationId :unassignid},include:{specialization:true}});
    
            const DeletSpecialty = await this.prisma.packageSpecialization.deleteMany({
                where : {
                    specializationId : unassignid
                }
            });
    
    
              const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:{include:{clinicUser : true}}}});
                let payload : WebhookNotificationDto ={
                        title : `The Specialty Un-assigned - ${assign?.specialization?.name}`,
                        area: "",
                        id : clinicdetails?.clinic.clinicUserUuid!,
                        message: `Admin has Un-assigned  ${assign?.specialization?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
                }
                await this.universalNotification.HandleNotification(payload);
                const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
                const emailText = `Admin has Un-assigned  ${assign?.specialization?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
                const htmlContent = EmailTemplate.getTemplate(emailText);
                await this.emailservice.sendEmail(
                        clinicdetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Specialty Un-Assigned - ${assign?.specialization?.name}`,  
                        "",            
                        htmlContent  
                );
    
    
    
            return{
                status  : 200,
                message : "Removed successfully"
            }
        }




        

 async getPackageSubSpecialty(packageid: string) {
        
        const getData = await this.prisma.packageSpecialty.findMany({
            where : {
                packageid : packageid
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

    
    async acceptSubSpecailty(id: string, packageid: string) {

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

        const updateSpecialization = await this.prisma.packageSpecialty.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                specialtyId : createSpecialization.id
            }
        });


          const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Sub-Specialty Request Accepted - ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `${clinicdetails?.clinic.name} has submitted a request has been accepted for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `${clinicdetails?.clinic.name} has submitted a request has been accepted for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Sub-Specialty Request Accepted - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );




        return{
            status : 200,
            message : "Category approved successfully"
        }
    }





    async rejectSubSpecailty(id: string, packageid: string) {

            const assign = await this.prisma.specializationRequest.findFirst({where:{id:id}});
         await this.prisma.packageSpecialty.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });




        const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Sub-Specialty Request Rejected - ${assign?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `${clinicdetails?.clinic.name} has submitted a request has been rejected for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `${clinicdetails?.clinic.name} has submitted a request has been rejected for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Sub-Specialty Request rejected - ${assign?.name}`,  
                    "",            
                    htmlContent  
            );

       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getSubSpecialty(packageid: string) {

        const getData = await this.prisma.specialty.findMany({
            include:{
                packageSpecialty:{
                    where :{
                        packageid : packageid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignSubSpecialty(assignid: string, packageid: string) {

       

        try {
            
        const assign = await this.prisma.packageSpecialty.create({
            data:{
                specialtyId : assignid,
                packageid:packageid
            },
            include:{
                specialty:true
            }
        });





         const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Sub-Specialty assigned - ${assign?.specialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has assigned  ${assign?.specialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has assigned  ${assign?.specialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Sub-Specialty Assigned - ${assign?.specialty?.name}`,  
                    "",            
                    htmlContent  
            );











        return{
            status : 201,
            message : "Specialty assigned successfully"
        }


        } catch (error) {
            console.log("error message",error.message);
        }

    }


    async unassignSubSpecialty(unassignid: string, packageid: string) {

        const assign = await this.prisma.packageSpecialty.findFirst({where:{specialtyId :unassignid},include:{specialty:true}});
        const DeletSpecialty = await this.prisma.packageSpecialty.deleteMany({
            where : {
                specialtyId : unassignid
            }
        });

         const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Sub-Specialty Un-assigned - ${assign?.specialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has Un-assigned  ${assign?.specialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has Un-assigned  ${assign?.specialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Sub-Specialty Un-Assigned - ${assign?.specialty?.name}`,  
                    "",            
                    htmlContent  
            );

        return{
            status  : 200,
            message : "Removed successfully"
        }
    }




    
    async getPackageTreatment(packageid: string) {
        
        const getData = await this.prisma.packageTreatment.findMany({
            where : {
                packageId : packageid
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

    
    async acceptTreatment(id: string, packageid: string) {

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

        const updateSpecialization = await this.prisma.packageTreatment.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                treatmentid : createSpecialization.id
            }
        });


        const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Treatment accepted - ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has accepted  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has accepted  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Treatment Accepted - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );

        return{
            status : 200,
            message : "Category approved successfully"
        }
    }


    async rejectTreatment(id: string, packageid: string) {

        const getSuggestedSpecialty = await this.prisma.specializationRequest.findFirst({where :{id : id}});
         await this.prisma.packageTreatment.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });


        
        const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Treatment rejected - ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has rejected  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has rejected  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Treatment Rejected - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );
       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getTreatment(packageid: string) {
        const getData = await this.prisma.treatment.findMany({
            include:{
                packageTreatments:{
                    where :{
                        packageId : packageid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignTreatment(assignid: string, packageid: string) {

       

        try {
            
             const assign = await this.prisma.packageTreatment.create({
            data:{
                treatmentid : assignid,
                packageId:packageid
            },
            include:{
                treatment : true
            }
        });


          const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Treatment assigned - ${assign?.treatment?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has assigned  ${assign?.treatment?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has assigned  ${assign?.treatment?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Treatment Assigned - ${assign?.treatment?.name}`,  
                    "",            
                    htmlContent  
            );






        return{
            status : 201,
            message : "Specialty assigned successfully"
        }


        } catch (error) {
            console.log("error message",error.message);
        }

    }

    async unassignTreatment(unassignid: string, packageid: string) {

        const assign= await this.prisma.packageTreatment.findFirst({where:{treatmentid : unassignid},include:{treatment:true}});
        const DeletSpecialty = await this.prisma.packageTreatment.deleteMany({
            where : {
                treatmentid : unassignid
            }
        });


         const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Treatment Un-assigned - ${assign?.treatment?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has Un-assigned  ${assign?.treatment?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has Un-assigned  ${assign?.treatment?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Treatment Un-Assigned - ${assign?.treatment?.name}`,  
                    "",            
                    htmlContent  
            );

        return{
            status  : 200,
            message : "Removed successfully"
        }

    }

    






      async getPackageProcedure(packageid: string) {
        
        const getData = await this.prisma.packageProcedure.findMany({
            where : {
                packageId : packageid
            },
            include:{
                procedure : true,
                suggestedCategory: true
            }
        });

        return{
            status : 200,
            data : getData
        }
    }

    
    async acceptProcedure(id: string, packageid: string) {

        const getSuggestedSpecialty =await this.prisma.specializationRequest.findFirst({
            where : {
                id:id
            }
        });

        const createSpecialization = await this.prisma.procedure.create({
            data : {
                name : getSuggestedSpecialty?.name || ""
            }
        });

        const updateSpecialization = await this.prisma.packageProcedure.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                procedureid : createSpecialization.id
            }
        });


        const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Procedure accepted - ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has accepted  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has accepted  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Procedure Accepted - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );

        return{
            status : 200,
            message : "Category approved successfully"
        }
    }


    async rejectProcedure(id: string, packageid: string) {

        const getSuggestedSpecialty = await this.prisma.specializationRequest.findFirst({where :{id : id}});
         await this.prisma.packageProcedure.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });


        
        const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Procedure rejected - ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has rejected  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has rejected  ${getSuggestedSpecialty?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Procedure Rejected - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );
       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getProcedure(packageid: string) {
        const getData = await this.prisma.procedure.findMany({
            include:{
                procedure:{
                    where :{
                        packageId : packageid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignProcedure(assignid: string, packageid: string) {

       

        try {
            
             const assign = await this.prisma.packageProcedure.create({
            data:{
                procedureid : assignid,
                packageId:packageid
            },
            include:{
                procedure : true
            }
        });


          const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Procedure assigned - ${assign?.procedure?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has assigned  ${assign?.procedure?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has assigned  ${assign?.procedure?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Procedure Assigned - ${assign?.procedure?.name}`,  
                    "",            
                    htmlContent  
            );






        return{
            status : 201,
            message : "Specialty assigned successfully"
        }


        } catch (error) {
            console.log("error message",error.message);
        }

    }

    async unassignProcedure(unassignid: string, packageid: string) {

        const assign= await this.prisma.packageProcedure.findFirst({where:{procedureid : unassignid},include:{procedure:true}});
        const DeletSpecialty = await this.prisma.packageProcedure.deleteMany({
            where : {
                procedureid : unassignid
            }
        });


         const clinicdetails = await this.prisma.clinicPackage.findUnique({where: { id: packageid },include:{clinic:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Procedure Un-assigned - ${assign?.procedure?.name}`,
                    area: "",
                    id : clinicdetails?.clinic.clinicUserUuid!,
                    message: `Admin has Un-assigned  ${assign?.procedure?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has Un-assigned  ${assign?.procedure?.name} to  ${clinicdetails?.clinic.name} clinic for package ${clinicdetails?.title}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.clinic.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Procedure Un-Assigned - ${assign?.procedure?.name}`,  
                    "",            
                    htmlContent  
            );

        return{
            status  : 200,
            message : "Removed successfully"
        }

    }



     async sendMessageToClinic(dto: SendMessageCreateDto) {
    
            
            const getClinicDetails = await this.prisma.clinicPackage.findUnique({
                where:{
                    id : dto.packageid!
                },
                include:{
                    clinic : true
                }
            });
    
            const bodyexternal = "Hi the clinic" + getClinicDetails?.clinic.name + `The Package  ${getClinicDetails?.title}`;
    
    
            if(dto.type === "send_message")
            {
                const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
                const emailText = emailTemplate?.body;
                const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
                await this.emailservice.sendEmail(
                        getClinicDetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + emailTemplate?.subject!,  
                        "",            
                        htmlContent  
                );
    
                let payload : WebhookNotificationDto ={
                    title : "New message " + ` | ${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
                    area: "clinic",
                    message : dto.messagetext,
                    id : String(getClinicDetails?.clinic.clinicUserUuid)
                }
    
                await this.universalNotification.HandleNotification(payload);
    
            }
            else if(dto.type === "send_active"){
    
                await this.prisma.clinicPackage.update({
                    where :{
                        id : getClinicDetails?.id
                    },
                    data:{
                        status : PackageVerifyStatus.VERIFIED,
                        reasontext : dto.messagetext
                    }
                });
    
                const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
                const emailText = emailTemplate?.body;
              const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
                await this.emailservice.sendEmail(
                        getClinicDetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + "Activated Package Successfully",  
                        "",            
                        htmlContent  
                );
    
                let payload : WebhookNotificationDto ={
                    title : `Activated Package Successfully ${getClinicDetails?.title} for clinic ` +  `${getClinicDetails?.clinic.name}`,
                    area: "clinic",
                    message : dto.messagetext,
                    id : String(getClinicDetails?.clinic.clinicUserUuid)
                }
                await this.universalNotification.HandleNotification(payload);
    
    
            }
            else if(dto.type === "send_inactive"){
    
                await this.prisma.clinicPackage.update({
                    where :{
                        id : getClinicDetails?.id
                    },
                    data:{
                        status : PackageVerifyStatus.PENDING,
                        reasontext : dto.messagetext
                    }
                });
    
                const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.NewMessageFromAdmin },});
                const emailText = emailTemplate?.body;
                const htmlContent = EmailTemplate.getTemplate(bodyexternal + dto.messagetext + "<br/>");
                await this.emailservice.sendEmail(
                        getClinicDetails?.clinic.email!,
                        `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + "Deactivated Package",  
                        "",            
                        htmlContent  
                );
    
                let payload : WebhookNotificationDto ={
                    title : `Deactivated Package ${getClinicDetails?.title} for clinic ` +  `${getClinicDetails?.clinic.name}`,
                    area: "clinic",
                    message : dto.messagetext,
                    id : String(getClinicDetails?.clinic.clinicUserUuid)
                }
                await this.universalNotification.HandleNotification(payload);
    
            }
            
            
            
    
    
    
    
            return{
                status : true
            }
        }
















}