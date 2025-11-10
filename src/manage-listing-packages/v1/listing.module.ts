


import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { ListingController } from './listing.controller';
import { LISTING_SERVICE_V1 } from '../constant/listing.constant';
import { ListingService } from './listing.service';
import { ListingBusiness } from './business/listing.business';




@Module({
    imports : [ActivityLogModule],
  controllers: [ListingController],
  providers: [
    {
      provide: LISTING_SERVICE_V1,
      useClass: ListingService,
    },

    RolesGuard, JwtService , PrismaService ,ListingBusiness
  ],
  
  
  exports: [LISTING_SERVICE_V1],
})




export class ListingPackageModule {}



