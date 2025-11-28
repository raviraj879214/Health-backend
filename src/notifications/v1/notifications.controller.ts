// notifications.controller.ts
import { Controller, Post, Body, Get, Param, Version, Req, UseGuards } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import type { AuthRequest } from "src/common/decorators/auth-request.interface";
import { RolesGuard } from 'src/common/guards/roles.guards';
import { ModuleAccess } from 'src/common/decorators/module-access.decorator';

@Controller('notifications')
@UseGuards(RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @Version("1")
  async send(@Body() body: { globaluserid: string; message: string; type?: string }) {
    await this.notificationsGateway.sendNotification(body);
    return { status: 'ok' };
  }

  @Get('user')
  @ModuleAccess('Manage Notification')
  @Version("1")
  async getUserNotifications(@Req() request: AuthRequest) {

    const globaluserid = request.user?.sub ; // JWT user id string
    console.log("globaluserid",globaluserid);

    return this.notificationsService.getUserNotifications(String(globaluserid));
  }

  @Get('/markread/:notificationId')
  @ModuleAccess('Manage Notification')
  @Version("1")
  async markAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationsService.markAsRead(Number(notificationId));
  }
}
