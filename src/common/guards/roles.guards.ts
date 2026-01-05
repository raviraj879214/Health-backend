import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
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
      throw new UnauthorizedException({
        status: 401,
        message: 'No token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    let payload: any;

    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'defaultSecretKey',
      });
    } catch (err) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Invalid or expired token',
      });
    }

    const roleModule = await this.prisma.roleModule.findFirst({
      where: {
        roleId: payload.roleId,
        module: { name: requiredModule },
        status: false,
      },
    });

    // console.log("payload.roleId",payload.roleId);
    // console.log("requiredModule",requiredModule);
    // console.log("roleModule",roleModule);
    


    if (!roleModule) {
      throw new ForbiddenException({ status: 999, message: 'restricted' });
    }


    const method = request.method;
    let permitted = false;

    if (method === 'GET') permitted = roleModule.canRead;
    if (method === 'POST') permitted = roleModule.canCreate;
    if (method === 'PUT' || method === 'PATCH') permitted = roleModule.canUpdate;
    if (method === 'DELETE') permitted = roleModule.canDelete;

    if (!permitted) {
      throw new ForbiddenException({
        status: 999,
        message: `You don't have permission to ${method} this module`,
      });
    }

    request.user = payload;
    return true;
  }
}
