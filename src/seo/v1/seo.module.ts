
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { SeoController } from './seo.controller';
import { SEO_SERVICE_V1 } from '../constant/seo.constant';
import { SeoServices } from './seo.service';
import { FileModule } from 'src/common/middleware/modules/file.module';
import { UploadMiddleware } from 'src/common/middleware/upload.middleware';
import { join } from 'path';


@Module({
    imports : [ActivityLogModule,FileModule],
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





 export class SeoModule implements NestModule{
 
   configure(consumer: MiddlewareConsumer) 
   {
      consumer.apply(UploadMiddleware(join('uploads/seocontent'))).forRoutes('v1/api/seo/update-og-image');
   }
 }


