
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { join } from 'path';
import { UploadMiddleware } from 'src/common/middleware/upload.middleware';
import { FileModule } from 'src/common/middleware/modules/file.module';
import { CategoryController } from './category.controller';
import { CATEGORY_SERVICE_V1 } from '../constant/category.constant';
import { CategoryService } from './category.service';


@Module({
    imports : [ActivityLogModule,
      FileModule
    ],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_SERVICE_V1,
      useClass: CategoryService,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  
  exports: [CATEGORY_SERVICE_V1],
})




export class CategoryModule {}




