import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { WebhookNotificationDto } from './webhook-notification.dto';


@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post('notify')
  async handleNotification(@Body() body: WebhookNotificationDto) {
    

    return this.notificationService.handleIncomingNotification(body);
  }


  @Get("get-notify/:userid")
  async getNotifications(@Param("userid") userid:string){
    return await this.notificationService.getNotifications(userid);
  }

  @Post("mark-as-read")
  async markasRead(@Body() dto:{id:string}){
    //console.log("dto.id",dto.id);
    return await this.notificationService.markAsRead(dto.id);
  }





}
