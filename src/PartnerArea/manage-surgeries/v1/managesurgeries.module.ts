import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/PartnerArea/ClinicAuth/JwtStrategy/jwt.strategy';
import { ManageSurgeriesController } from './managesurgeries.controller';
import { MANAGE_SURGERIES_CONSTANT_V1 } from '../constant/managesurgeries.constant';
import { ManageSurgeries } from './managesurgeries.service';
import { UploadMiddleware } from 'src/common/middleware/upload.middleware';
import { join } from 'node:path';
import { FileModule } from 'src/common/middleware/modules/file.module';



@Module({
 
 imports : [FileModule],
 
  controllers: [ManageSurgeriesController],

  providers: [
    {
      provide: MANAGE_SURGERIES_CONSTANT_V1,
      useClass: ManageSurgeries,
    },
    PrismaService,
    JwtStrategy
  ],

  exports: [MANAGE_SURGERIES_CONSTANT_V1],
})
export class ManageSurgeriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) 
  {

     consumer.apply(UploadMiddleware(join(process.cwd(), 'uploads', 'surgery/beforeandafter'))) .forRoutes('v1/api/manage-surgeries/insert-surgeries-images');


  }
}

