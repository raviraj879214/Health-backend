



import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { PurchasedPackagesController } from './purchasedpackages.controller';
import { PURCHASED_PACKAGE_SERVICE_V1 } from '../constant/purchasedpackage.constant';
import { PurchasedPackagesService } from './purchasedpackages.service';
import { PurchasedPackagesBusiness } from './business/purchasedpackages.business';




@Module({
    imports : [ActivityLogModule],
  controllers: [PurchasedPackagesController],
  providers: [
    {
      provide: PURCHASED_PACKAGE_SERVICE_V1,
      useClass: PurchasedPackagesService,
    },

    RolesGuard, JwtService , PrismaService ,PurchasedPackagesBusiness
  ],
  
  
  exports: [PURCHASED_PACKAGE_SERVICE_V1],
})




export class PurchasedPackagesModule {}



