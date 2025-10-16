// src/users/users.controller.ts
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, Version } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Post()
  @Version("1")
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @Version("1")
  findAll( @Query('page') page: string,@Query('limit') limit: string) {

      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;




     return this.usersService.getUsers(pageNumber,pageSize);
  }

  @Get(':id')
  @Version("1")
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }

  @Patch(':id')
  @Version("1")
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), dto);
  }

  @Delete(':id')
  @Version("1")
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }





  
}
