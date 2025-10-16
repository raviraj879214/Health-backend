// src/test/test.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TestController } from './test.controller';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { EmailTestService } from './test.service';



@Module({
  controllers: [TestController],
  providers: 
  [
    {
      provide: 'ITestService',
      useClass: EmailTestService, // any service implementing the interface
    },
  ]
})


export class TestModule {}
