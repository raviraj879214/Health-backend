// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.get<string>('module', context.getHandler());
    if (!requiredModule) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException({ status: 401, message: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'defaultSecretKey',
      });
    } catch (err) {
      throw new UnauthorizedException({ status: 401, message: 'Invalid or expired token' });
    }

    const roleModules = await this.prisma.roleModule.findMany({
        where: { 
          roleId: payload.roleId, // filter by specific roleId
          status: 1               // filter by status = 1 (active/assigned)
        },
        include: { 
          module: true            // include related module data in the result
        },
      });




    const hasModule = roleModules.some(rm => rm.module.name === requiredModule);
    if (!hasModule) {
      // Custom restricted response
      throw new ForbiddenException({ status: 999, message: 'restricted' });
    }

    request.user = payload;
    return true;
  }
}
