// src/notifications/notifications.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage('send_notification')
  async handleNotification(@MessageBody() data: { userId: number; message: string; type?: string }) {

    console.log('Received from client:', data);

    const notification = await this.notificationsService.createNotification(data.userId, data.message, data.type);

    
    this.server.emit('receive_notification', notification);

  }

 
  async sendNotification(data: { userId: number; message: string; type?: string }) {

    const notification = await this.notificationsService.createNotification(data.userId, data.message, data.type);


    
    this.server.emit('receive_notification', notification);
  }
}
