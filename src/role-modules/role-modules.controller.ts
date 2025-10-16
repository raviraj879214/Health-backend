// src/role-modules/role-modules.controller.ts
import { Controller, Post, Get, Delete, Body, Param, Put } from '@nestjs/common';
import { RoleModulesService } from './role-modules.service';
import { AssignModulesDto } from './dto/assign-modules.dto';
import { RemoveModuleDto } from './dto/remove-module.dto';
import { UpdateRoleModuleDto } from './dto/UpdateRoleModuleDto ';



@Controller('role-modules')
export class RoleModulesController {
  constructor(private readonly roleModulesService: RoleModulesService) {}

  @Post('assign')
  assignModules(@Body() dto: AssignModulesDto) {
    return this.roleModulesService.assignModules(dto);
  }


  
    @Put('update-role-module')
    upadteroleModule(@Body() dto: UpdateRoleModuleDto) {
      const roleId = Number(dto.roleId);
      const moduleId = Number(dto.moduleId);
      const status = Number(dto.status); // if status is 0/1

      return this.roleModulesService.updateRoleModule(roleId, moduleId, status);
    }




  @Get(':roleId')
  getRoleModules(@Param('roleId') roleId: string) {
    return this.roleModulesService.getRoleModules(Number(roleId));
  }


  @Delete('remove')
  removeModule(@Body() dto: RemoveModuleDto) {
    return this.roleModulesService.removeModule(dto);
  }








}
