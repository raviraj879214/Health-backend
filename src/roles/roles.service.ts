import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';



@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}



async createRole(dto: CreateRoleDto) {
  // Check if role already exists

  const existingRole = await this.prisma.role.findUnique({
    where: { name: dto.name },
  });

  if (existingRole) {
    return {
      status: 400, // 400 is better than 404 here
      message: 'Role already exists',
    };
  }

  // Create new role
  const role = await this.prisma.role.create({
    data: { name: dto.name },
  });

  
  const assignmodel = await this.prisma.module.findMany({});

    await Promise.all(


      assignmodel.map(element =>
        this.prisma.roleModule.create({
          data: {
            roleId: role.id,
            moduleId: element.id,
            status: 1,
          },
        })
      )


    );







  return {
    status: 200,
    message: 'Role created successfully',
    data: role,
  };
}




  

async getRoles(page: number, limit: number) {
  const totalCount = await this.prisma.role.count(); // total rows

  const roles = await this.prisma.role.findMany({
   where: {
      name: {
        not: "SuperAdmin",
      },
    },
    orderBy: { createdAt: 'desc' }, 
    skip: (page - 1) * limit, 
    take: limit,
    
  });

  return { roles, totalCount }; // send roles + total count
}





  getRoleById(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }

async updateRole(id: number, dto: UpdateRoleDto) {
  // check if another role with the same name already exists
  const exist = await this.prisma.role.findFirst({
    where: {
      name: dto.name,
      NOT: { id }, // exclude current role id
    },
  });

  if (exist) {
    return {
      status: 404,
      message: "Role already exists"
    };
  }

const updatedRole = await this.prisma.role.update({
  where: { id },
  data: { name: dto.name },
});

return {
  status: 200,
  message: "Role updated successfully",
  data: updatedRole,
};

  

}

async deleteRole(id: number) {
  try {
    const deletedRole = await this.prisma.role.delete({
      where: { id },
      
    });

    return {
      status: 200,
      message: 'Role deleted successfully',
      data: deletedRole,
    };
  } catch (error) {
    // If the role doesn't exist or some error occurs
    return {
      status: 404,
      message: 'Role not found or could not be deleted',
      data: null,
    };
  }
}

}
