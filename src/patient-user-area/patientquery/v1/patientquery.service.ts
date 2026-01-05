import { Injectable } from "@nestjs/common";
import { IPatietnQuery } from "../interface/patientquery.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailTemplate } from "src/common/emailtemplate/email-template";
import { Emailenumconsts } from "src/common/emailtemplate/emailenums";
import { EmailService } from "src/EmailServices/email.service";





@Injectable()
export class PatientQueryServices implements IPatietnQuery{

    constructor(private readonly prisma:PrismaService,
         private emailservice : EmailService
    ){}


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
            const emailText = emailTemplate?.body;
            const htmlContent = EmailTemplate.getTemplate(emailText).replace("${otp}",otp.toString());

            await this.emailservice.sendEmail(email,`${emailTemplate?.subject}`,  "",htmlContent);

            
            return{
                status : true,
                otp: otp
            }
    }



}