
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { SpecialtyController } from './specialities.controller';
import { SPECIALTY_SERVICE_V1 } from '../constant/specialities.constant';
import { SpecialtyServices } from './specialities.service';



@Module({
    imports : [ActivityLogModule],
  controllers: [SpecialtyController],
  providers: [
    {
      provide: SPECIALTY_SERVICE_V1,
      useClass: SpecialtyServices,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  
  exports: [SPECIALTY_SERVICE_V1],
})




export class SpecialtyModule {}



