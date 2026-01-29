import { Module } from '@nestjs/common';
import { ManageClinicController } from './manageclinic.controller';
import { MANAGE_CLINIC_SERVICES_V1 } from '../constant/manage.clinic.constant';
import { ManageClinicService } from './manageclinic.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy';
import { ManageClinicBusiness } from './business/manageclinic.business';
import { UniversalNotificationnModule } from 'src/notification/GlobalNotification/businessnotificationmodule';
import { EmailService } from 'src/EmailServices/email.service';


@Module({
 
  imports :[UniversalNotificationnModule],
  controllers: [ManageClinicController],

  providers: [
    {
      provide: MANAGE_CLINIC_SERVICES_V1,
      useClass: ManageClinicService,
    },
    PrismaService,
    JwtStrategy,
    ManageClinicBusiness,
    EmailService
  ],

  exports: [MANAGE_CLINIC_SERVICES_V1],
})
export class ManageClinichModule {}
