import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy';
import { UploadMiddleware } from 'src/common/middleware/upload.middleware';
import { join } from 'node:path';
import { FileModule } from 'src/common/middleware/modules/file.module';
import { ManageBannerController } from './managebanner.controller';
import { MANAGE_BANNER_SERVICES } from '../constant/managebanner.constant';
import { ManageBannerService } from './managebanner.service';



@Module({
  imports : [FileModule],
  controllers: [ManageBannerController],
  providers: [
    {
      provide: MANAGE_BANNER_SERVICES,
      useClass: ManageBannerService,
    },
    PrismaService,
    JwtStrategy
  ],
  exports: [MANAGE_BANNER_SERVICES],
})


export class ManageBannerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) 
  {

     consumer.apply(UploadMiddleware(join(process.cwd(), 'uploads', 'clinic/banner'))) .forRoutes('v1/api/manage-clinic-banner/insert-banner-images');


  }
}



