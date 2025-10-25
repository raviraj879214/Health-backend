
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { SpecialtyTypeController } from './specialty.type.controller';
import { SPECIALTY_TYPE_SERVICE_V1 } from '../constant/specialty.type.constant';
import { SpecialtyTypeService } from './specialty.type.service';



@Module({
    imports : [ActivityLogModule],
  controllers: [SpecialtyTypeController],
  providers: [
    {
      provide: SPECIALTY_TYPE_SERVICE_V1,
      useClass: SpecialtyTypeService,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  
  exports: [SPECIALTY_TYPE_SERVICE_V1],
})




export class SpecialtyTypeModule {}



