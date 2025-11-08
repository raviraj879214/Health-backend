// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwtService: JwtService) {}




async login(dto: LoginDto) {
  const { email, password } = dto;

  const user = await this.prisma.user.findUnique({
    where: { email },
    include: { role: { include: { modules: { include: { module: true } } } } },
  });

  if (!user) throw new UnauthorizedException('Invalid credentials');

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

  const payload = { sub: user.id, roleId: user.roleId };

  const permissions = await this.prisma.roleModule.findMany({
    where: { roleId: Number(user.roleId) },
    include: { module: true },
  });

  const token = this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET || 'defaultSecretKey',
    expiresIn: '3600s',
  });

  console.log(Date.now());



  return { access_token: token, user, permissions };
}





}
