import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  providers: [EmailService,PrismaService],
  controllers: [EmailController],
  exports: [EmailService], // optional if you want to use it in other modules
})
export class EmailModule {}
