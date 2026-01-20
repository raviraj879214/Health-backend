import { Injectable } from "@nestjs/common";
import { IPatietnQuery } from "../interface/patientquery.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { Emailenumconsts } from "src/common/emailtemplate/emailenums";
import { EmailService } from "src/EmailServices/email.service";
import Twilio from 'twilio';
import type { Twilio as TwilioClient } from 'twilio';




@Injectable()
export class PatientQueryServices implements IPatietnQuery{

    private client: TwilioClient;


    constructor(private readonly prisma:PrismaService,
         private emailservice : EmailService,
         
    ){
        this.client = Twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
    }


    async getSpecialties() {
        const getSpec = await this.prisma.specialization.findMany({});

        return{
            data : getSpec,
            status : 200
        }
    }



    async sendEmailOtp(email: string) {
        

            let otp = Math.floor(100000 + Math.random() * 900000).toString();

            if (process.env.NODE_ENV === 'local') {
                 otp = '000000'; 
            }

            

            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.PatientEmailVerify },});
            const emailText = `Hi, your OTP for email verification is ${otp}. Please use this to verify your email.`;
            const htmlContent = EmailTemplate.getTemplate(emailText);

            await this.emailservice.sendEmail(email,`Email Verification`,  "",htmlContent);

            
            return{
                status : true,
                otp: otp
            }
    }



    async getCordinatorDetails(clinicid: string) {
      const data = await this.prisma.clinic.findUnique({
                where: { uuid: clinicid },
                select: {
                    cordinator: {
                    select: {
                        whatsappNumber: true,
                        telegramNumber: true,
                        messengerID: true,
                    },
                    },
                },
         });


        return{
            status: 200,
            data : data
        }
    }





    async sendOtp(phone: string, otp: string) {
            try {
                const message = await this.client.messages.create({
                    body: `Your OTP for phone number verification is ${otp}. Please do not share this code with anyone.`,
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



















}