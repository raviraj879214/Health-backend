import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly postmarkApiUrl = 'https://api.postmarkapp.com/email';
  private readonly postmarkApiToken = process.env.POSTMARK_SERVER_API_TOKEN;



  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<boolean> {
    const payload = {
      From: `${process.env.POSTMARK_EMAIL}`, 
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html,
    };

    try {
      const response = await axios.post(this.postmarkApiUrl, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': this.postmarkApiToken,
        },
      });

      this.logger.log('✅ Email sent successfully');
      this.logger.debug(response.data);

      return true;
    } catch (error: any) {
      this.logger.error('❌ Error sending email');
      this.logger.error(error.response?.data || error.message);
      throw error;
    }
  }
}