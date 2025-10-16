import { Controller, Get, Post, Body, Param, Put, Delete , Query, Version  } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './roles.service';
import type { Response } from 'express';


@Controller('roles')

export class RoleController {
  constructor(private readonly roleService: RoleService) {}



  @Post()
  @Version('1')
  create(@Body() dto: CreateRoleDto) {
     return this.roleService.createRole(dto);
  }



  


    @Get()
    @Version('1')
    async findAll(
      @Query('page') page: string,
      @Query('limit') limit: string
    ) {
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      return this.roleService.getRoles(pageNumber, pageSize);
    }


  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.roleService.getRoleById(Number(id));
  }

  @Put(':id')
  @Version('1')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(Number(id), dto);
  }

  @Delete(':id')
  @Version('1')
  remove(@Param('id') id: string) {

     return this.roleService.deleteRole(Number(id));

  }
  
}
