
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { SeoController } from './seo.controller';
import { SEO_SERVICE_V1 } from '../constant/seo.constant';
import { SeoServices } from './seo.service';


@Module({
    imports : [ActivityLogModule],
  controllers: [SeoController],
  providers: [
    {
      provide: SEO_SERVICE_V1,
      useClass: SeoServices,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  
  exports: [SEO_SERVICE_V1],
})




export class SeoModule {}



