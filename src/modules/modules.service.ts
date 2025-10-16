// src/modules/modules.service.ts
import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async createModule(dto: CreateModuleDto) {
    return this.prisma.module.create({ data: dto });
  }

  async getModules() {
    return this.prisma.module.findMany();
  }

  async getModuleById(id: number) {
    return this.prisma.module.findUnique({ where: { id } });
  }

  async updateModule(id: number, dto: UpdateModuleDto) {
    return this.prisma.module.update({ where: { id }, data: dto });
  }

  async deleteModule(id: number) {
    return this.prisma.module.delete({ where: { id } });
  }
}
