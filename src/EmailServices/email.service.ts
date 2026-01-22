import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as util from 'util';

@Injectable()
export class EmailService {
  private transporter;

 constructor() {
  this.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,         
    secure: true,     
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD, 
    },
    logger: true,
    debug: true,
    connectionTimeout: 10000, 
  });
}


  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    try {
      // const info = await this.transporter.sendMail(mailOptions);
      // console.log('✅ Email sent successfully');
      // console.log(info);

      // return info;


        return true;
    } catch (error) {

      console.log('❌ Error sending email');


      console.log('Message:', error.message);


      console.log('Stack:', error.stack);

      console.log(
        'Full Error Object:',
        util.inspect(error, { showHidden: true, depth: null }),
      );

      throw error;
    }
  }
}
