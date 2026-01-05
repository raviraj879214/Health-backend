import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationService } from "../notification.service";
import { WebhookNotificationDto } from "../webhook-notification.dto";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";







@Injectable()
export class UniversalNotification{
     

  constructor(private readonly httpService: HttpService) {}



async HandleNotification(dto: WebhookNotificationDto) {


  
    

    try {
      
      const url = `${process.env.BACK_END_PUBLI_URL}/v1/webhook/notify`;

    // POST request
    const response = await lastValueFrom(
      this.httpService.post(url, dto, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    console.log('response.data', response.data);
    return response.data;

    } catch (error) {
         console.log("dfdfd",error.message);

    }

  }



}