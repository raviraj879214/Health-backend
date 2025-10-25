// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';



export interface DBNotification {
  id: number;
  userId?: number | null;
  message: string;
  isRead: boolean;
  type?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(userId: number, message: string, type?: string): Promise<DBNotification> {

    return this.prisma.notification.create({
      data: { userId, message, type },
    });
    
  }

  async getUserNotifications(userId?: number): Promise<DBNotification[]> {
  
  if (userId) {
    return this.prisma.notification.findMany({
      where: { userId ,isRead : false },
      orderBy: { createdAt: 'desc' }
    });
  }

 
  return this.prisma.notification.findMany({
    where : {isRead : false},
    orderBy: { createdAt: 'desc' }
  });

}




  async markAsRead(notificationId: number): Promise<DBNotification> {
    return this.prisma.notification.update({
      where: { id: Number(notificationId) },
      data: { isRead: true },
    });
  }



  
}
