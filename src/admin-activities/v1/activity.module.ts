// src/activity/activity.module.ts
import { Module } from '@nestjs/common';
import { AdminActivityController } from './activity.controller';
import { ACTIVITY_SERVICE_V1 } from '../constants/activity.constants';
import { ActivityService } from './activity.service';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [AdminActivityController],
  providers: [
    {
      provide: ACTIVITY_SERVICE_V1,
      useClass: ActivityService,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  exports: [ACTIVITY_SERVICE_V1],
})
export class ActivityModule {}
