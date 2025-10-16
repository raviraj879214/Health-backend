// src/role-modules/role-modules.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleModulesService } from './role-modules.service';
import { RoleModulesController } from './role-modules.controller';


@Module({
  controllers: [RoleModulesController],
  providers: [RoleModulesService, PrismaService],
})
export class RoleModulesModule {}
