import { Injectable } from "@nestjs/common";
import { IDoctorServices } from "../interface/doctor.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { DoctorAddress, DoctorUpdateDto } from "./dto/doctor.update.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { DoctorVerifyStatus } from "src/common/enum/doctorVerifyStatus";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";




@Injectable()
export class DoctorServices implements IDoctorServices{

    constructor(
        private readonly prisma:PrismaService,
        private readonly universalNotification:UniversalNotification,
        private emailservice : EmailService

    ){}


    async getDoctors(clinicuuid: string) {
    
                const assignments = await this.prisma.clinicDoctor.findMany({
                where: {
                    clinicUuid: clinicuuid,
                },
                });

          
                const doctorUuids = assignments.map((a) => a.doctorUuid);

             
            const assignedDoctors = await this.prisma.doctor.findMany({
                where: {
                    uuid: {
                        in: doctorUuids,
                    },
                     OR: [
                        { DoctorVerify: DoctorVerifyStatus.VERIFIED },
                        { DoctorVerify: DoctorVerifyStatus.EDIT },
                    ],
                },
             });


         return {
            status : 200,
            message : "fetch doctors successfully",
            data : assignedDoctors
         }
    }


    



     async getClinicDoctorList(clinicuuid: string) {

        const getData = await this.prisma.clinicDoctor.findMany({
            where :{
                clinicUuid : clinicuuid
            }
        });


        const doctorslistids = getData.map((a) => a.doctorUuid);


        return {}



    }


    

    async createUpdateDoctor(dto: DoctorUpdateDto) {

        console.log("existDoctor",dto.doctoruuid);

        if(dto.doctoruuid !== "null"){

             var existDoctor =await this.prisma.doctor.findUnique({
                where : {
                    uuid : dto.doctoruuid
                }
            });

            const doctorUpdate = await this.prisma.doctor.update({
                where :{
                    uuid : dto.doctoruuid
                },
                data :{
                    firstname : dto.firstname,
                    lastname : dto.lastname,
                    email: dto.email,
                    dob:dto.dob,
                    crm:dto.crm,
                    languages:dto.languages,
                    videurl:dto.videourl,
                    image : dto.image_url,
                    cpf : dto.cpf,
                    degree : dto.degree

                }
            });


            
            


            return {
                status : 200 ,
                message : "Doctor updated successfully",
                data : existDoctor
            }
        }
        else{

           const checkcrm = await this.prisma.doctor.findFirst({
                    where: {
                        crm: String(dto.crm || "")
                    }
            });


            if(checkcrm){
                
                return{
                    status : 401
                }
            }


            



             const doctorCreate = await this.prisma.doctor.create({
                data :{
                    firstname : dto.firstname,
                    lastname : dto.lastname,
                    email: dto.email,
                    dob:dto.dob,
                    crm:dto.crm,
                    languages:dto.languages,
                    videurl:dto.videourl,
                    clinicuuid : dto.clinicuuid,
                    image : dto.image_url,
                    cpf : dto.cpf,
                    degree : dto.degree
                }


            });


             
            

            await this.prisma.clinicDoctor.create({
                data : {
                    clinicUuid : dto.clinicuuid!,
                    doctorUuid : doctorCreate.uuid
                }
            });


            const clinicdetails = await this.prisma.clinic.findUnique({
                where: { uuid: dto.clinicuuid },
            });



            let payload : WebhookNotificationDto ={
                        title : "Doctor Profile Added",
                        area: "admin",
                        message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} created doctor successfully`
            }

            // await this.universalNotification.HandleNotification(payload);

             return {
                status : 201,
                message : "Doctor created successfully",
                data : doctorCreate
            }
        }
    }



    async  getDoctorDetails(doctoruuid: string) {
        const Doctordetails =await this.prisma.doctor.findFirst({
            where :{
                uuid : doctoruuid
            },
            include :{
                clinicDoctorAddress : {
                    where:{
                        doctorUuid : doctoruuid
                    }
                }
            }
        });


        return {
            message : "Doctor details fetched successfully",
            data : Doctordetails,
            status : 200
        }
    }


    async getGlobalDoctorsList(clinicUuid:string){

        
        const getDoctorids = await this.prisma.clinicDoctor.findMany({
            where :{
                clinicUuid : clinicUuid
            }
        });


        const doctrorids = getDoctorids.map((item)=> item.doctorUuid);



        const getAllData = await this.prisma.doctor.findMany({
            where : {
                uuid :{
                    notIn :doctrorids
                }
            }
        });

        return {
            status : 200,
            data : getAllData
        }
    }


     async assignDoctorsClinic(dto: DoctorUpdateDto) {

                if (!dto.clinicuuid) {
                    throw new Error("clinicUuid is required");
                }

                if (!dto.doctoruuid) {
                     throw new Error("doctorUuid is required");
                }

                const created = await this.prisma.clinicDoctor.create({
                        data: {
                            clinicUuid: dto.clinicuuid,
                            doctorUuid: dto.doctoruuid,
                        },
                });

                return{
                        status : 201,
                        message : "Doctors assigned to clinic successfully"
                    }
                }

   

                async getClinicAddress(clinicuuid: string) {
                    const getData = await this.prisma.clinic.findUnique({
                        where :{
                            uuid : clinicuuid
                        }
                    });

                    return{
                        status : 200,
                        data : getData
                    }
                }


                async updateDoctorAddress(dto: DoctorAddress) {
                    console.log("dto",dto);



                   




                     if(dto.id !== ''){

                        await this.prisma.clinicDoctorAddress.update({
                            where:{
                                id : dto.id
                            },
                            data: {
                                street: dto.logradouro,
                                complement: dto.complemento,
                                zipcode: dto.cep,
                                postalUnit: dto.cep, 
                                neighborhood: dto.bairro,
                                city: dto.localidade,
                                stateCode: dto.uf,
                                stateName: dto.estado,
                                region: dto.regiao,
                                ibgeCode: dto.ibge,
                                giaCode: dto.gia,
                                areaCode: dto.ddd,
                                siafiCode: dto.siafi,
                            }
                        });
                        return{
                            status : 200
                        }
                     }
                     else{

                        await this.prisma.clinicDoctorAddress.create({
                            data: {

                                clinicUuid: dto.clinicuuid,
                                doctorUuid: dto.doctoruuid,
                                street: dto.logradouro,
                                complement: dto.complemento,
                                zipcode: dto.cep,
                                postalUnit: dto.cep, 
                                neighborhood: dto.bairro,
                                city: dto.localidade,
                                stateCode: dto.uf,
                                stateName: dto.estado,
                                region: dto.regiao,
                                ibgeCode: dto.ibge,
                                giaCode: dto.gia,
                                areaCode: dto.ddd,
                                siafiCode: dto.siafi,
                            }
                        });

                        return{
                            status : 200
                        }
                     }
                }



                async getDoctorAddress(clinicuuid: string, doctoruuid: string) {
                    
                    const data = await this.prisma.clinicDoctorAddress.findFirst({
                        where :{
                            doctorUuid : doctoruuid,
                            clinicUuid : clinicuuid
                        }
                    });

                    return{
                        status : 200,
                        data : data
                    }
                }




                async submitDoctor(clinicuuid: string, doctoruuid: string) {

                    const updateDoctor = await this.prisma.doctor.update({
                        where:{
                            uuid : doctoruuid
                        },
                        data:{
                            DoctorVerify : DoctorVerifyStatus.PENDING,
                        }
                    });




                    const clinicdetails = await this.prisma.clinic.findUnique({where: { uuid: clinicuuid },});
                     const adminemail = await this.prisma.user.findFirst({where :{role : {name : "SuperAdmin"}},select:{email : true}});
                    let payload : WebhookNotificationDto ={
                        title : "Doctor Profile Added",
                        area: "admin",
                        message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} created doctor successfully,sent for approval please visit clinic and make approval`
                    }
                    await this.universalNotification.HandleNotification(payload);

                    const emailText =  `Hi Admin, <br/><br/>  <b>${clinicdetails?.name ?? 'Unknown clinic'}</b> created doctor successfully,sent for approval please visit clinic and make approval <br/><br/>`
                    const htmlContent = EmailTemplate.getTemplate(emailText);
                    await this.emailservice.sendEmail(adminemail?.email!,`${process.env.NEXT_PUBLIC_PROJECT_NAME} | Doctor profile sent for approval`,  "",htmlContent);

                    return{
                        status : true
                    }

                }




}