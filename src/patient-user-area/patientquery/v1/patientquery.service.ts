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

            // if (process.env.NODE_ENV === 'local') {
            //      otp = '000000'; 
            // }

            

            const emailTemplate = await this.prisma.emailTemplate.findUnique({where: { name: Emailenumconsts.PatientEmailVerify },});
            const emailText = `
              <p>Hi, your OTP for email verification is:</p>
              <p style="color: red; font-size: 28px; font-weight: bold;">
                ${otp}
              </p>
              <p>Please use this OTP to verify your email.</p>
            `;
            const htmlContent = EmailTemplate.getTemplate(emailText);

            await this.emailservice.sendEmail(email,`Email Verification`,  "",htmlContent);

            
            return{
                status : true,
                otp: otp
            }
    }



  async getCordinatorDetails(clinicid: string) {

   console.log("clinicid",clinicid);

   
    const clinic = clinicid === "demo-id"
      ? 
      
      await this.prisma.user.findUnique({
        where: {
          id: 1  
        },
        select: {
          whatsappNumber: true,
          telegramNumber: true,
          messengerID: true,
        }
      })


      : await this.prisma.clinic.findUnique({
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

       console.log("cordinator clinic",clinic);

    return {
      status: 200,
      data: clinic,
    };
  }






  async sendOtp(phone: string,otp:string) {
    try {
      const verification = await this.client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verifications.create({
          to: phone,
          channel: "sms",
        });

      return {
        success: true,
        sid: verification.sid,
        status: verification.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : error,
      };
    }
  }




  async otpverification(phone: string, otp: string, sid: string) {

    console.log(phone, otp, sid);
    try {
      const result = await this.client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks.create({
          to: phone,
          code: otp,
        });

      return {
        success: result.status === "approved",
        status: result.status,
      };
    } catch (error) {
      console.log(error instanceof Error ? error.message : error);
      return {
        success: false,
        error: error instanceof Error ? error.message : error,
      };
    }
  }


















}