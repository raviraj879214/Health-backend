import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleService } from './roles.service';
import { RoleController } from './roles.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
})
export class RoleModule {}
