
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogController } from './blog.controller';
import { Blog_SERVICE_V1 } from '../constants/blog.constant';
import { BlogServices } from './blog.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { join } from 'path';
import { UploadMiddleware } from 'src/common/middleware/upload.middleware';
import { FileModule } from 'src/common/middleware/modules/file.module';


@Module({
    imports : [ActivityLogModule,
      FileModule
    ],
  controllers: [BlogController],
  providers: [
    {
      provide: Blog_SERVICE_V1,
      useClass: BlogServices,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  
  exports: [Blog_SERVICE_V1],
})




export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) 
  {

     consumer.apply(UploadMiddleware(join(process.cwd(), 'uploads', 'blogs'))) .forRoutes('v1/api/blog/create-blog','v1/api/blog/update-blog');

  }
}




