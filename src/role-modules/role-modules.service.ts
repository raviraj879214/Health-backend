// src/role-modules/role-modules.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignModulesDto } from './dto/assign-modules.dto';
import { RemoveModuleDto } from './dto/remove-module.dto';


@Injectable()
export class RoleModulesService {
  constructor(private prisma: PrismaService) {}

  async assignModules(dto: AssignModulesDto) {
    const { roleId, moduleIds } = dto;
    await this.prisma.roleModule.deleteMany({ where: { roleId } });
    const data = moduleIds.map((moduleId) => ({ roleId, moduleId }));
    return this.prisma.roleModule.createMany({ data });
  }

  async getRoleModules(roleId: number) {
    
  const roleModules = await this.prisma.roleModule.findMany({
        where: { roleId },
        select: {
          status: true,
          module: true,
        },
      });

      return roleModules.map((rm) => ({
        ...rm.module,   // spread all module fields
        status: rm.status, // keep status too
      }));

  }

  async removeModule(dto: RemoveModuleDto) {
    const { roleId, moduleId } = dto;
    return this.prisma.roleModule.delete({
      where: { roleId_moduleId: { roleId, moduleId } },
    });
  }


  // service or repository layer
async updateRoleModule(roleId: number, moduleId: number, status: number) {
  roleId = Number(roleId);
  moduleId = Number(moduleId);
  status = Number(status);

  const existing = await this.prisma.roleModule.findFirst({
    where: { roleId, moduleId },
  });

  if (!existing) throw new Error("Role module not found");

  const data = await this.prisma.roleModule.update({
    where: { id: existing.id },
    data: { status },
  });

  return {
    status: 200,
    message: "Role module updated successfully",
    data,
  };
}












}



