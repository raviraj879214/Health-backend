import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { WebhookNotificationDto } from './webhook-notification.dto';


@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post('notify')
  async handleNotification(@Body() body: WebhookNotificationDto) {
    
    console.log('Webhook received:', body);

    return this.notificationService.handleIncomingNotification(body);
  }


  @Get("get-notify")
  async getNotifications(){

    return await this.notificationService.getNotifications();
  }





}
