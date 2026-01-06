import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as util from 'util';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD, // App password
      },
      logger: true, // Nodemailer logs
      debug: true,  // Show SMTP traffic
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
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully');
      console.log(info);
      return info;
    } catch (error) {
      // Use console.log instead of console.error
      console.log('❌ Error sending email');

      // Exact error message
      console.log('Message:', error.message);

      // Stack trace
      console.log('Stack:', error.stack);

      // Full error object (all hidden properties too)
      console.log(
        'Full Error Object:',
        util.inspect(error, { showHidden: true, depth: null }),
      );

      throw error; // optional
    }
  }
}
