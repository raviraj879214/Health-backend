import { BadRequestException, Get, Injectable } from "@nestjs/common";
import { IPartnerRegister } from "../interface/partnerregister.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { PartnerRegister } from "src/common/enum/PartnerRegister";
import * as bcrypt from 'bcrypt';
import { PartnerRegisterClinicDetails, partnerRegisterCreateDto } from "./dto/partnerregister.update.dto";
import { EmailService } from "src/EmailServices/email.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { Emailenumconsts } from "src/common/emailtemplate/emailenums";
import { ClinicStatus } from "src/common/enum/ClinicStatus";
import Twilio from 'twilio';
import type { Twilio as TwilioClient } from 'twilio';
import { WebhookNotificationDto } from "src/notification/webhook-notification.dto";
import { UniversalNotification } from "src/notification/GlobalNotification/businessnotification";
import { PatientRegister } from "src/common/enum/PatientRegistration";







@Injectable()
export class PartnerRegisterServices implements IPartnerRegister {

    private client: TwilioClient;

    constructor(private readonly prisma: PrismaService, private emailservice: EmailService,
        private readonly universalNotification: UniversalNotification,
    ) {

        this.client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }



    async validateEmailAndOtp(email: string) {

        const checkEmail = await this.prisma.clinicUser.findFirst({
            where: {
                email: email,
                status: PatientRegister.ACTIVE
            }
        });




        console.log("checkEmail",checkEmail);
        
        if (checkEmail && checkEmail?.status !== PartnerRegister.ACTIVE) {
            console.log("1");

            return {
                status: 404,
                message: "Email Already exist"
            }
        }
        else if (!checkEmail) {
            console.log("2");


            let randomOtp: string;
            if (process.env.NODE_ENV === 'local') {
                randomOtp = '0000';
            } else {
                randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
            }


            const hash = await bcrypt.hash("Aalpha@100", 10);
            const createEmail = await this.prisma.clinicUser.create({
                data: {
                    email: email,
                    passwordHash: hash
                }
            });


            const emailTemplate = await this.prisma.emailTemplate.findUnique({ where: { name: Emailenumconsts.PartnerOTPEmail }, });

            const otptext = `${randomOtp}`;

            const emailText = emailTemplate?.body.replace('${randomOtp}', otptext);


            const htmlContent = EmailTemplate.getTemplate(emailText);

            await this.emailservice.sendEmail(
                email,
                emailTemplate?.subject!,
                "",
                htmlContent
            );



            return {
                status: "Email Created and sent otp to registered email",
                data: createEmail,
                otp: randomOtp
            }

        }
        else if (checkEmail?.isOtpVerify == false && checkEmail.status == PartnerRegister.PENDING) {
            console.log("3");
            let randomOtp: string;
            if (process.env.NODE_ENV === 'local') {
                randomOtp = '0000';
            } else {
                randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
            }




            const emailTemplate = await this.prisma.emailTemplate.findUnique({ where: { name: Emailenumconsts.PartnerOTPEmail }, });

            const otptext = `${randomOtp}`;

            const emailText = emailTemplate?.body.replace('${randomOtp}', otptext);


            const htmlContent = EmailTemplate.getTemplate(emailText);

            await this.emailservice.sendEmail(
                email,
                emailTemplate?.subject!,
                "",
                htmlContent
            );

            return {
                status: "Email Created and sent otp to registered email",
                data: checkEmail,
                otp: randomOtp
            }
        }
        else if (checkEmail?.isOtpVerify == true && checkEmail.status == PartnerRegister.PENDING) {
            console.log("4");
            return {
                status: 200,
                data: checkEmail
            }
        }
        else if (checkEmail.email === email && checkEmail.status !== PartnerRegister.PENDING) {
            console.log("5");
            return {
                status: 404,
                message: "This email is already registered. Please log in to continue."
            }
        }
        else {

            return {
                status: 404,
                data: checkEmail
            }
        }


    }











    async updateOtpServices(dto: partnerRegisterCreateDto) {

        console.log("dto.uuid", dto.uuid);
        const updatData = await this.prisma.clinicUser.update({
            where: { uuid: String(dto.uuid) },
            data: {
                isOtpVerify: dto.isOtpVerify
            }
        });

        return {
            status: 200,
            message: "User updated successfully"
        }
    }


    async getClinicUserDetail(uuid: string) {

        const getData = await this.prisma.clinicUser.findFirst({
            where: {
                uuid: uuid
            }
        });

        return {
            status: 200,
            data: getData
        }
    }

    async insertClinicUserDetails(dto: partnerRegisterCreateDto) {


        const hashed = await bcrypt.hash(dto.password!, 10);

        const updateData = await this.prisma.clinicUser.update({
            where: { uuid: String(dto.uuid) },
            data: {
                firstname: String(dto.firstname),
                lastname: String(dto.lastname),
                phone: dto.phonenno,
                passwordHash: hashed,
                email: dto.email

            }
        });


        return {
            status: 200,
            message: "user updated successfully"
        }

    }


    async getClinicDetails(uuid: string) {

        const clinicdetails = await this.prisma.clinic.findFirst({
            where: {
                clinicUserUuid: uuid
            }
        });

        return {
            status: 200,
            data: clinicdetails
        }
    }


    async insertClinicDetails(dto: PartnerRegisterClinicDetails) {
        try {


            const existingClinic = await this.prisma.clinic.findFirst({
                where: {
                    name: dto.name,
                },
            });


            if (existingClinic && existingClinic.clinicUserUuid !== dto.uuid && dto.name) {
                return {
                    statusCode: 400,
                    message: "Clinic name already exists"
                }
            }

            const checkexist = await this.prisma.clinic.findFirst({
                where: {
                    clinicUserUuid: dto.uuid
                }
            });



            if (dto.cnpj !== undefined) {
                    console.log("checked",dto.cnpj);
                    console.log("dto.clinicid",dto.clinicid);
                    const checkcnpj = await this.prisma.clinic.findFirst({
                    where: {
                        clinicUserUuid: {
                            not: dto.uuid
                        },
                        cnpj: dto.cnpj
                    }
                });
                if (checkcnpj) {
                    console.log("returned");
                    return {
                        statusCode: 401,
                        message: 'CNPJ already exists',
                    }
                }
            }

            const clinicuserdetails = await this.prisma.clinicUser.findFirst({ where: { uuid: dto.uuid } });


            if (checkexist !== null) {
                    
                const updateData = await this.prisma.clinic.update({
                    where: { uuid: String(checkexist.uuid) },
                    data: {
                        ...(dto.name !== "" && { name: dto.name }),
                        ...(dto.cnpj !== "" && { cnpj: dto.cnpj }),
                        websiteurl: dto.websiteurl,
                        email: dto.clinicemail,
                        status: ClinicStatus.PENDING,
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                        phone: dto.phone,
                        citycep: dto.city,
                        street: dto.street,
                        address_number : dto.addressnumber,
                        complement: dto.complement,
                        neighborhood: dto.neighborhood,
                        cep: dto.cep,
                        state: dto.state,
                        phoneVerify: dto.phoneVerify,
                        clinicUserId: clinicuserdetails?.id,
                        addressnumber : dto.addressnumber,
                        unidade : dto.unidade,
                        estado : dto.estado,
                        regiao : dto.regiao,
                        ibge : dto.ibge,
                        gia : dto.gia,
                        ddd : dto.ddd,
                        siafi : dto.siafi
                    }
                });
                return {
                    status: 200,
                    data: updateData
                }
            }

             


            const clinic = await this.prisma.clinic.create({
                data: {
                    name: dto.name,
                    websiteurl: dto.websiteurl,
                    clinicUserUuid: dto.uuid,
                    email: dto.clinicemail,
                    cnpj: dto.cnpj,
                    phone: dto.phone,
                    phoneVerify: dto.phoneVerify,
                    userId: 1,
                    clinicUserId: clinicuserdetails?.id
                },
            });



            return {
                status: 200,
                data: clinic
            }

        } catch (error) {
            console.log(error.message);
        }
    }


    async insertMoreClinicDetails(dto: PartnerRegisterClinicDetails) 
    {
        const checkcnpj = await this.prisma.clinic.findFirst({
                    where: {
                        clinicUserUuid: {
                            not: dto.uuid
                        },
                        cnpj: dto.cnpj
                    }
          });

          if(checkcnpj !== null){
            return{
                statusCode : 401,
                message : "cnpj already exist"
            }
          }


          

         const clinicExists = await this.prisma.clinic.findFirst({
            where: { name: dto.name },
            select: { id: true },
        });

        if (clinicExists) {
            
             return{
                statusCode : 402,
                message : "Clinic name already exists"
            }
        }



        console.log("insert more clinic",dto);


        if (dto.TermsID !== '') {
            const clinicuserid = await this.prisma.clinicUser.findFirst({where:{uuid: dto.uuid}});
            const getstripedetails = await this.prisma.clinic.findFirst({where:{cnpj : dto.cnpj}});

            const createClinic = await this.prisma.clinic.create({
                data: {
                    name: dto.name,
                    websiteurl: dto.websiteurl,
                    clinicUserUuid: dto.uuid,
                    email: dto.clinicemail,
                    cnpj: dto.cnpj,
                    TermsID: dto.TermsID,
                    userId: 1,
                    CheckedTime: new Date(),
                    clinicUserId : clinicuserid?.id,
                    onboardingUrl : getstripedetails?.onboardingUrl,
                    stripeaccountid : getstripedetails?.stripeaccountid,
                    isStripeVerify : getstripedetails?.isStripeVerify
                }
            });


        const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: createClinic.uuid },include:{clinicUser:true} });
        let payload: WebhookNotificationDto = {
            title: "New Partner Registered",
            area: "admin",
            message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has just been registered as a new partner. The partner would like to update their clinic details. Basic information has already been submitted and can be reviewed in the admin section.`
        }
        await this.universalNotification.HandleNotification(payload);


         const adminemail = await this.prisma.user.findFirst({where:{role:{name : "SuperAdmin"}}});
        const adminemailText = `Hi,<br/><br/>
                            ${clinicdetails?.name ?? 'Unknown clinic'} has just been registered as a new partner.<br/>
                            The partner would like to update their clinic details. Basic information has already been submitted and can be reviewed in the admin section.<br/>`;
        const adminhtmlContent = EmailTemplate.getTemplate(adminemailText);
        await this.emailservice.sendEmail(adminemail?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | New Clinic Registration Successfull`, "", adminhtmlContent);









        }
        
        return{
            status : true
        }
    }






    async getCountryCity() {

        const country = await this.prisma.country.findMany({
            include: {
                cities: true
            }
        });
        const state = await this.prisma.city.findMany({});


        return {
            status: 200,
            country: country,
            state: state
        }
    }



    async sendOtp(phone: string, otp: string) {
        try {
            const message = await this.client.messages.create({
                body: `Your OTP for clinic number verification is ${otp}. Please do not share this code with anyone.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });

            return {
                success: true,
                sid: message.sid,
                otp: otp
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }





    async verifyOtp(cliniciduuid: string, phoneverify: string) {

        const updateData = await this.prisma.clinicUser.update({
            where: {
                uuid: cliniciduuid
            },
            data: {
                phoneVerify: 1
            }
        });

        return {
            status: 200,
            data: updateData
        }
    }





    async accepttermsCondition(dto: PartnerRegisterClinicDetails) {


        const getdata = await this.prisma.clinic.update({
            where: {
                uuid: dto.clinicid
            },
            data: {
                CheckedTime: new Date(),
                TermsID: dto.TermsID,
                clinicUser:{
                    update:{
                        status : PartnerRegister.ACTIVE
                    }
                }
            },
            include:{
                clinicUser : true
            }
        });


        const clinicdetails = await this.prisma.clinic.findUnique({ where: { uuid: dto.clinicid },include:{clinicUser:true} });
        let payload: WebhookNotificationDto = {
            title: "New Partner Registered",
            area: "admin",
            message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has just been registered as a new partner. The partner would like to update their clinic details. Basic information has already been submitted and can be reviewed in the admin section.`
        }
        await this.universalNotification.HandleNotification(payload);

        let payloadclinic: WebhookNotificationDto = {
            title: "New Partner Registered",
            id: getdata.clinicUserUuid!,
            area: "",
            message: `Clinic: ${clinicdetails?.name ?? 'Unknown clinic'} has just been registered as a new partner. Please fill all clinic details to list in front end`
        }
        await this.universalNotification.HandleNotification(payloadclinic);


        const emailText = `Hi,<br/><br/>
                            ${clinicdetails?.name ?? 'Unknown clinic'} has just been registered as a new partner.<br/>
                            Please log in to the dashboard and complete all clinic details so the clinic can be listed on the front end.<br/>`;
        const htmlContent = EmailTemplate.getTemplate(emailText);
        await this.emailservice.sendEmail(clinicdetails?.clinicUser?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | Clinic Registration Successfull`, "", htmlContent);


        const adminemail = await this.prisma.user.findFirst({where:{role:{name : "SuperAdmin"}}});
        const adminemailText = `Hi,<br/><br/>
                            ${clinicdetails?.name ?? 'Unknown clinic'} has just been registered as a new partner.<br/>
                            The partner would like to update their clinic details. Basic information has already been submitted and can be reviewed in the admin section.<br/>`;
        const adminhtmlContent = EmailTemplate.getTemplate(adminemailText);
        await this.emailservice.sendEmail(adminemail?.email!, `${process.env.NEXT_PUBLIC_PROJECT_NAME} | New Clinic Registration Successfull`, "", adminhtmlContent);




        return {
            status: 200,
            data: getdata
        }
    }



    async getTermsCondition(name: string) {
        const getTerms = await this.prisma.terms_and_conditions.findFirst({
            where: {
                name: name,
                is_active: true
            }
        });

        return {
            status: 200,
            data: getTerms
        }
    }






}