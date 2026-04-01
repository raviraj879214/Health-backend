import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from './email.service';


@Module({
  providers: [EmailService,PrismaService],
  controllers: [EmailController],
  exports: [EmailService], // optional if you want to use it in other modules
})
export class EmailModule {}
