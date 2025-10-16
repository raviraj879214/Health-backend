// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

async createUser(dto: CreateUserDto) {
  const exist = await this.prisma.user.findUnique({
    where: { email: dto.email }
  });

  if (exist) {
    return {
      status: 409, // conflict
      message: "Email already exists"
    };
  }

          const hashedPassword = await bcrypt.hash(dto.password, 10);

          const data = await this.prisma.user.create({
            data: {
              email: dto.email,
              firstname: dto.firstname,
              roleId : Number(dto.roleId),
              lastname: dto.lastname,
              Bio: dto.Bio, // adjust casing to match your Prisma schema
              password: hashedPassword,
            },
          });

          return {
            status: 201, // created
            message: "User created successfully",
            data,
          };
   }




  async getUsers(page: number, limit: number) 
  {

    const totalCount = await this.prisma.user.count();
    
      const users = await this.prisma.user.findMany({
         where: {
          role: {
            name: {
              not: "SuperAdmin", // excludes users with role SuperAdmin
            },
          },
        },
        skip: (page - 1) * limit, 
        take: limit,
        include:{
          role:{
            select:{
              name :true
            }
          }
        }
      });

      return { users, totalCount }; // send roles + total count
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: { include: { modules: { include: { module: true } } } } },
    });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async deleteUser(id: number) {
     try {
    const deletedRole = await this.prisma.user.delete({
      where: { id },
    });

    return {
      status: 200,
      message: 'User deleted successfully',
      data: deletedRole,
    };
  } catch (error) {
    // If the role doesn't exist or some error occurs
    return {
      status: 404,
      message: 'User not found or could not be deleted',
      data: null,
    };
  }
  }



}
