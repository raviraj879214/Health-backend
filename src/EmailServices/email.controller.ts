import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailTemplate } from 'src/common/emailtemplate/email-template';



@Controller('email')
export class EmailController {

  constructor(private readonly emailService: EmailService,private readonly prisma: PrismaService) {}


  @Post('send')
  async send(@Body() body: { to: string; subject: string; text?: string }) {

    const emailTemplate = await this.prisma.emailTemplate.findUnique({
      where: { name: 'PASSWORD_RESET' },
    });

    const emailText = emailTemplate?.body || body.text || "";

    const htmlContent = EmailTemplate.getTemplate(emailText);

    return await this.emailService.sendEmail(
      body.to,
      body.subject,  
      "",            
      htmlContent  
    );

    

  }


}
