// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  
  ) {}

  async login(dto: LoginDto) {

    try {
      
    } catch (error) {
      console.log("Login error:", error);

    return {
      success: false,
      message: "Something went wrong while logging in",
      error: error.message,
    };
    }
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: { role: { include: { modules: { include: { module: true } } } } },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, roleId: user.roleId };

    // const token = this.jwtService.sign(payload, {
    //   secret: process.env.JWT_SECRET || 'defaultSecretKey',
    //   expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
    // });

    return { access_token: this.jwtService.sign(payload), user };
  }



}
