// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface DBNotification {
  id: number;
  globaluserid?: string | null;
  message: string;
  isRead: boolean;
  type?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(globaluserid: string, message: string, type?: string): Promise<DBNotification> {
    return this.prisma.notification.create({
      data: { globaluserid, message, type },
    });
  }

  async getUserNotifications(globaluserid: string): Promise<DBNotification[]> {
    return this.prisma.notification.findMany({
      where: { globaluserid, isRead: false },
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
