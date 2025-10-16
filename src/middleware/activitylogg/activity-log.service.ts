
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ActivityLogService {

  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    userId: number;
    action: string;
    description: string;
    entityType: string;
    entityId: number;
    ipAddress: string;
    userAgent: string;
  }) {
    return this.prisma.activityLog.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }

}
