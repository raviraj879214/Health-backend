import { PrismaService } from "src/prisma/prisma.service";
import { Blog_SERVICE_V1 } from "../constants/blog.constant";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "src/common/guards/roles.guards";
import { BlogServices } from "./blog.services";
import { BlogController } from "./blog.controller";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UploadMiddleware } from "src/common/middleware/upload.middleware";
import { join } from "path";
import { FileModule } from "src/common/middleware/modules/file.module";
import { ActivityLogModule } from "src/middleware/activitylogg/activity-log.module";







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







 export class ManageBlogModule implements NestModule{
 
   configure(consumer: MiddlewareConsumer) 
   {
      consumer.apply(UploadMiddleware(join('uploads/blogs'))).forRoutes('v1/api/manage-blog/create-blog');
 
   }
 }