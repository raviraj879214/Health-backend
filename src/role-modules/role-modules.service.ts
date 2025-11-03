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
          canCreate : true,
          canUpdate : true,
          canDelete : true,
          canRead: true,
          module: true,
        },
      });

      return roleModules.map((rm) => ({

        ...rm.module,  
        status: rm.status,
        canCreate : rm.canCreate,
        canRead :  rm.canRead,
        canUpdate : rm.canUpdate,
        canDelete : rm.canDelete
      }));

  }

  async removeModule(dto: RemoveModuleDto) {
    const { roleId, moduleId } = dto;
    return this.prisma.roleModule.delete({
      where: { roleId_moduleId: { roleId, moduleId } },
    });
  }


  // service or repository layer
async updateRoleModule(roleId: number, moduleId: number, field: string, value: number) {
  roleId = Number(roleId);
  moduleId = Number(moduleId);
  value = Number(value);

  // ✅ Allowed permission fields based on Prisma model
  const validFields = ["canRead", "canCreate", "canUpdate", "canDelete" , "status"];

  if (!validFields.includes(field)) {
    throw new Error(`Invalid permission field: ${field}`);
  }

  const existing = await this.prisma.roleModule.findFirst({
    where: { roleId, moduleId },
  });

  if (!existing) {
    throw new Error("Role module not found");
  }

  const data = await this.prisma.roleModule.update({
    where: { id: existing.id },
    data: { [field]: Boolean(value) }, 
  });


  return {
    status: 200,
    message: `Role module '${field}' updated successfully`,
    data,
  };
}












}



