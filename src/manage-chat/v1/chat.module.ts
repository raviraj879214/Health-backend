
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogModule } from 'src/middleware/activitylogg/activity-log.module';
import { ChatController } from './chat.controller';
import { CHAT_SERVICE_V1 } from '../constant/chat.constant';
import { ChatServices } from './chat.service';



@Module({
    imports : [ActivityLogModule],
  controllers: [ChatController],
  providers: [
    {
      provide: CHAT_SERVICE_V1,
      useClass: ChatServices,
    },
    RolesGuard, JwtService , PrismaService
  ],
  
  
  exports: [CHAT_SERVICE_V1],
})




export class ChatModule {}



