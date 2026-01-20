import { Injectable } from "@nestjs/common";
import { IManageDoctor } from "../interface/managedoctor.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { EmailService } from "src/EmailServices/email.service";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { DoctorVerifyStatus } from "src/common/enum/doctorVerifyStatus";


@Injectable()
export class ManageDoctorServices implements IManageDoctor{
    constructor(
         private readonly prisma:PrismaService,
         private readonly universalNotification:UniversalNotification,
         private emailservice : EmailService
    ){}





    async  getDoctorDetails(id: string) {
        
        const doctorDetails = await this.prisma.doctor.findFirst({
            where: {
                uuid: id
            }
        });


        return{
            status : 200,
            data : doctorDetails
        }

    }

     async getDoctorSurgeryImages(id: string) {
        const surgeryImages = await this.prisma.clinicSurgeryImage.findMany({
            where : {
                doctorUuid : id
            }
        });

        return{
            status : 200,
            data : surgeryImages
        }
    }

    async getDoctorsClinic(id: string) {
            const getDoctorsClinics = await this.prisma.clinicDoctor.findMany({
                where : {
                    doctorUuid : id
                },
                include:{
                    clinic : {
                    
                        include : {
                            country : true,
                            city : true,
                            clinicDoctorAddress : {
                                where :{
                                    doctorUuid : id
                                }
                            }
                        }
                    },
                }
            });

            const clinicuuids = getDoctorsClinics.map(item=> item.clinicUuid);


            const ClinicImages = await Promise.all(
                    clinicuuids.map(uuid =>
                        this.prisma.clinicImages.findFirst({
                        where: { clinicuuid: uuid },
                        orderBy: { createdAt: 'asc' } 
                        })
                    )
                 );



           

            return {
                status : 200,
                data : getDoctorsClinics,
                ClinicImages
            }

    }


    //specialty 
     async getDoctorSpecialty(doctoruuid: string) {
        
        const getData = await this.prisma.doctorSpecialization.findMany({
            where : {
                doctorUuid : doctoruuid
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

    
    async acceptSpecailty(id: string , doctoruuid: string) {

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

        const updateSpecialization = await this.prisma.doctorSpecialization.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                specializationId : createSpecialization.id
            }
        });



           const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
           const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Specialty Request Accepted - ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `${clinicdetails?.name} has submitted a request has been accepted for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `${clinicdetails?.name} has submitted a request has been accepted for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Specialty Request Accepted - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );






        return{
            status : 200,
            message : "Category approved successfully"
        }
    }



    async rejectSpecailty(id: string, doctoruuid: string) {


          await this.prisma.doctorSpecialization.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });



         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
           const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Specialty Request Rejected - ${deleteSuggested?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `${clinicdetails?.name} has submitted a request has been rejected for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `${clinicdetails?.name} has submitted a request has been rejected for Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Specialty Request Rejected - ${deleteSuggested?.name}`,  
                    "",            
                    htmlContent  
            );
       




        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }


    async getSpecialty(doctoruuid: string) {
        const getData = await this.prisma.specialization.findMany({
            include:{
                doctors:{
                    where :{
                        doctorUuid : doctoruuid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }


    async assignSpecialty(assignid: string, doctoruuid: string) {

        const assign = await this.prisma.doctorSpecialization.create({
            data:{
                specializationId: assignid,
                doctorUuid:doctoruuid
            },
            include:{
                specialization : true
            }
        });


         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
           const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The New Specialty has been assigned- ${assign.specialization?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has assigned specialty to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has assigned specialty to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The New Specialty has been assigned - ${assign.specialization?.name}`,  
                    "",            
                    htmlContent  
            );



        return{
            status : 201,
            message : "Specialty assigned successfully"
        }
    }


    async unassignSpecialty(unassignid: string, doctoruuid: string) {

        const assign = await this.prisma.doctorSpecialization.findFirst({
            where:{
                specializationId : unassignid 
            },
            include:{
                specialization : true
            }
         });


        const DeletSpecialty = await this.prisma.doctorSpecialization.deleteMany({
            where : {
                specializationId : unassignid
            }
        });

         


          const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
           const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The  Specialty has been Un-assigned- ${assign?.specialization?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has Un-assigned specialty to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has Un-assigned specialty to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The  Specialty has been Un-assigned - ${assign?.specialization?.name}`,  
                    "",            
                    htmlContent  
            );

            

        return{
            status  : 200,
            message : "Removed successfully"
        }
    }




    //doctor specialty
   async acceptSubSpecailty(id: string,doctoruuid:string) {

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

        const updateSpecialization = await this.prisma.doctorSpecialty.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                specialtyId : createSpecialization.id
            }
        });

         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The  Sub-Specialty has been accepted- ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has accepted Sub-specialty to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has accepted Sub-specialty to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The  Sub-Specialty has been accepted - ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );




        return{
            status : 200,
            message : "Category approved successfully"
        }
    }


    async rejectSubSpecailty(id: string,doctoruuid:string) {


         await this.prisma.doctorSpecialty.deleteMany({
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


  


    async assignSubSpecialty(assignid: string, doctoruuid: string) {

       

        try {
            
             const assign = await this.prisma.doctorSpecialty.create({
                    data:{
                        specialtyId : assignid,
                        doctorUuid:doctoruuid
                    },
                    include:{
                        specialty : true
                    }
            });

            const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The New Sub-Specialty has been assigned- ${assign.specialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has assigned Sub-specialty to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has assigned Sub-specialty to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The New Sub-Specialty has been assigned - ${assign.specialty?.name}`,  
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

    async unassignSubSpecialty(unassignid: string, doctoruuid: string) {

        const assign = await this.prisma.doctorSpecialty.findFirst({where:{specialtyId : unassignid},include:{specialty:true}})
        const DeletSpecialty = await this.prisma.doctorSpecialty.deleteMany({
            where : {
                specialtyId : unassignid
            }
        });


         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The  Sub-Specialty has been Un-assigned- ${assign?.specialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has Un-assigned Sub-specialty to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has Un-assigned Sub-specialty to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The New Sub-Specialty has been Un-assigned - ${assign?.specialty?.name}`,  
                    "",            
                    htmlContent  
            );


        return{
            status  : 200,
            message : "Removed successfully"
        }

    }




     async getDoctorSubSpecialty(doctoruuid: string) {
        
        const getData = await this.prisma.doctorSpecialty.findMany({
            where : {
                doctorUuid : doctoruuid
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

      async getSubSpecialty(doctoruuid: string) {
        const getData = await this.prisma.specialty.findMany({
            include:{
                doctors:{
                    where :{
                        doctorUuid : doctoruuid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }
   

    //end sub specialty



    //treatmetn
        

    async assignTreatment(assignid: string, doctoruuid: string) {
        try {
            
        const assign = await this.prisma.doctorTreatment.create({
            data:{
                treatmentid : assignid,
                doctorUuid:doctoruuid
            },
            include:{
                treatment : true
            }
        });


            const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The  New Treatment has been assigned- ${assign?.treatment?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has assigned Treatment to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has assigned Treatment to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The  New Treatment has been assigned- ${assign?.treatment?.name}`,  
                    "",            
                    htmlContent  
            );

            return{
                status : 201,
                message : "Specialty assigned successfully"
            }


        }
        catch (error)
        {
            console.log("error message",error.message);
        }

    }




    async unassignTreatment(unassignid: string, doctoruuid: string) {
        const assign = await this.prisma.doctorTreatment.findFirst({where:{treatmentid : unassignid},include:{treatment: true}});
        const DeletSpecialty = await this.prisma.doctorTreatment.deleteMany({
            where : {
                treatmentid : unassignid
            }
        });


         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The  Treatment has been Un-assigned- ${assign?.treatment?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has Un-assigned Treatment to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has Un-assigned Treatment to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The  Treatment has been Un-assigned- ${assign?.treatment?.name}`,  
                    "",            
                    htmlContent  
            );


        return{
            status  : 200,
            message : "Removed successfully"
        }

    }


    
    async acceptTreatment(id: string,doctoruuid:string) {

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

        const updateSpecialization = await this.prisma.doctorTreatment.updateMany({
            where : {
                suggestedCategoryId : getSuggestedSpecialty?.id 
            },
            data :{
                suggestedCategoryId : null,
                treatmentid : createSpecialization.id
            }
        });



         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Treatment has been accepted- ${getSuggestedSpecialty?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has accepted Treatment to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has accepted Treatment to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The  Treatment has been accepted- ${getSuggestedSpecialty?.name}`,  
                    "",            
                    htmlContent  
            );












        return{
            status : 200,
            message : "Category approved successfully"
        }
    }



    async rejectTreatment(id: string,doctoruuid:string){

        const assign = await this.prisma.specializationRequest.findFirst({where:{id : id,}});

         await this.prisma.doctorTreatment.deleteMany({
            where :{
                suggestedCategoryId : id
            }
        });
        

        const deleteSuggested = await this.prisma.specializationRequest.delete({
            where :{
                id : id
            }
        });




         const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Treatment has been rejected- ${assign?.name}`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has rejected Treatment to Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has rejected Treatment to  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname}. please visit your clinic dashbaord.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The  Treatment has been rejected- ${assign?.name}`,  
                    "",            
                    htmlContent  
            );



        return{
            status : 200,
            message : "Deleted successfully"
        }
        
    }





    async getTreatment(doctoruuid: string) {
        const getData = await this.prisma.treatment.findMany({
            include:{
                doctorTreatments:{
                    where :{
                        doctorUuid : doctoruuid
                    }
                }
            }
        });

        return{
            status : 200,
            data : getData
        }
    }

     async getDoctorTreatment(doctoruuid: string) {
        
        const getData = await this.prisma.doctorTreatment.findMany({
            where : {
                doctorUuid : doctoruuid
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


   
    //end


    async doctorUpdateStatus(status: string, doctoruuid: string, reason: string) {

        const updateData = await this.prisma.doctor.update({
            where :{
                uuid : doctoruuid
            },
            data :{
                DoctorVerify : Number(status),
                Reason : reason
            }
        });


        if(DoctorVerifyStatus.INACTIVE === Number(status)){

            const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Doctor Profile Has Been Marked as Inactive`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has rejected  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname} profile. please visit your clinic dashbaord. Reason :  ${reason}`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has rejected   Dr. ${doctordetails?.firstname} ${doctordetails?.lastname} profile. please visit your clinic dashbaord. <br/> Reason :  ${reason} <br/>`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Doctor Profile Has Been Marked as Inactive`,  
                    "",            
                    htmlContent  
            );

        }
        else if(DoctorVerifyStatus.VERIFIED === Number(status)){

             const doctordetails =await this.prisma.doctor.findUnique({where : {uuid : doctoruuid}});
            const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: doctordetails?.clinicuuid! },include:{clinicUser:true}});
            let payload : WebhookNotificationDto ={
                    title : `The Doctor Profile Has Been Marked as active`,
                    area: "",
                    id : clinicdetails?.clinicUserUuid!,
                    message: `Admin has rejected  Dr. ${doctordetails?.firstname} ${doctordetails?.lastname} profile. please visit your clinic dashbaord. Reason :  ${reason}`
            }
            await this.universalNotification.HandleNotification(payload);
            const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});                               
            const emailText = `Admin has rejected   Dr. ${doctordetails?.firstname} ${doctordetails?.lastname} profile. please visit your clinic dashbaord. <br/> Reason : ${reason}  <br/>`;
            const htmlContent = EmailTemplate.getTemplate(emailText);
            await this.emailservice.sendEmail(
                    clinicdetails?.email!,
                    `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ` + `The Doctor Profile Has Been Marked as active`,  
                    "",            
                    htmlContent  
            );
        }











        return{
            status : 200,
            data : updateData
        }
    }














}