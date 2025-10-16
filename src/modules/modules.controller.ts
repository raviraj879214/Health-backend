// src/modules/modules.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, Version } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';


@Controller('modules')
export class ModulesController {

  constructor(private readonly modulesService: ModulesService) {}

  
  @Post()
  @Version("1")
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.createModule(dto);
  }

  @Get()
  @Version("1")
  findAll() {
    return this.modulesService.getModules();
  }

  @Get(':id')
  @Version("1")
  findOne(@Param('id') id: string) {
    return this.modulesService.getModuleById(Number(id));
  }

  @Patch(':id')
  @Version("1")
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.updateModule(Number(id), dto);
  }

  @Delete(':id')
  @Version("1")
  remove(@Param('id') id: string) {
    return this.modulesService.deleteModule(Number(id));
  }
}
