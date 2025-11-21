import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { IClinicAuthService } from "../interface/clinic.interface";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class ClinicService implements IClinicAuthService{

    constructor(
        private readonly prisma:PrismaService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, pass: string) {
         const user = await this.prisma.clinicUser.findUnique({ where: { email } });

            if (!user) throw new UnauthorizedException('User not found');
            const isValid = await bcrypt.compare(pass, user.passwordHash);

            if (!isValid) throw new UnauthorizedException('Invalid password');
            if (!user.isActive) throw new UnauthorizedException('User is inactive');
            return user;
    }




   async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const access_token = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '10s' }  // short time
        );

        const refresh_token = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '7d' }   // long time
        );

        // Save refresh token
        await this.prisma.clinicUser.update({
            where: { id: user.id },
            data: { refreshToken: refresh_token },
        });

        return {
            access_token,
            refresh_token,
            user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            },
        };
        }




    async createClinicUser(data: { email: string; password: string; phone?: string }) {
        const exist = await this.prisma.clinicUser.findUnique({ where: { email: data.email } });
        if (exist) throw new ConflictException('Email already exists');

        const hashed = await bcrypt.hash(data.password, 10);

        const newUser = await this.prisma.clinicUser.create({
            data: {
                email: data.email,
                passwordHash: hashed,
                phone: data.phone,
                isActive: true,
                isVerified: false
            }
        });

        return {
            message: "Clinic user created successfully",
            id: newUser.id,
            email: newUser.email
        };
    }



    async refresh(token: string) {
        try {
            const payload = this.jwtService.verify(token);

            const user = await this.prisma.clinicUser.findUnique({
            where: { id: payload.sub },
            });

            if (!user || user.refreshToken !== token) {
            throw new UnauthorizedException('Invalid refresh token');
            }

            const newAccessToken = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '10s' }
            );

            return { access_token: newAccessToken };
        } catch {
            throw new UnauthorizedException('Refresh token expired or invalid');
        }
        }


        
        async logout(userId: number) {
            await this.prisma.clinicUser.update({
                where: { id: userId },
                data: { refreshToken: null },
            });
            return { message: 'Logged out successfully' };
        }


    async verifyToken(token: string) {
        try
        {
            const payload = this.jwtService.verify(token); // throws if invalid
            const user = await this.prisma.clinicUser.findUnique({ where: { id: payload.sub } });
            if (!user) throw new UnauthorizedException('User not found');
            return { id: user.id, email: user.email, phone: user.phone };
        }
        catch (err)
        {
            throw new UnauthorizedException('Invalid or expired token');
        }
        
    }


        


}