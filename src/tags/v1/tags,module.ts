
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { Tag_SERVICE_V1 } from '../constants/tags.constant';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';


@Module({
    imports : [ActivityLogModule
     
    ],
  controllers: [TagsController],
  providers: [
    {
      provide: Tag_SERVICE_V1,
      useClass: TagsService,
    },

    PrismaService
  ],
  
  
  exports: [Tag_SERVICE_V1],
})

export class TagsModule{}




