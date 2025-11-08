

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { PatientController } from './patients.controller';
import { PATIENTS_ADMIN_SERVICE_V1 } from '../constant/patients.constant';
import { PatientService } from './patients.services';
import { PatientBusiness } from './business/PatientBusiness';



@Module({
    imports : [ActivityLogModule],
  controllers: [PatientController],
  providers: [
    {
      provide: PATIENTS_ADMIN_SERVICE_V1,
      useClass: PatientService,
    },

    RolesGuard, JwtService , PrismaService ,PatientBusiness
  ],
  
  
  exports: [PATIENTS_ADMIN_SERVICE_V1],
})




export class PatientModule {}



