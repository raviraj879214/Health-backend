// src/notifications/notifications.controller.ts
import { Controller, Post, Body, Get, Param, Version } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @Version("1")
  async send(@Body() body: { userId: number; message: string; type?: string }) {
    await this.notificationsGateway.sendNotification(body);
    return { status: 'ok' };
  }

  @Get('user/:userId')
  @Version("1")
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(Number(userId));
  }
}
