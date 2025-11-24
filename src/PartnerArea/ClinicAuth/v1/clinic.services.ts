import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { IClinicAuthService } from "../interface/clinic.interface";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { updateClinicUser } from "./dto/clinic.update.dt";
import { clinicAuthBusiness } from "./business/clinicauth.business";


@Injectable()
export class ClinicService implements IClinicAuthService{

    constructor(
        private readonly prisma:PrismaService,
        private jwtService: JwtService,
        private businessclinic: clinicAuthBusiness
    ){}

    async validateUser(email: string, pass: string) {
  try {
    console.log("JWT Secret:", process.env.JWT_SECRET); // Optional debug

    const user = await this.prisma.clinicUser.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(pass, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    return user;
  } catch (error) {
    throw new UnauthorizedException(error.message);
  }
}


async login(email: string, password: string) {
  try {
    const user = await this.validateUser(email, password);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret key not configured');
    }

    const access_token = this.jwtService.sign(
      { email: user.email, sub: user.uuid },
      { expiresIn: '1d' }
    );

    console.log("access_token",access_token);
    const refresh_token = this.jwtService.sign(
      { email: user.email, sub: user.uuid },
      { expiresIn: '7d' }
    );

    // Save refresh token
    await this.prisma.clinicUser.update({
      where: { id: user.id },
      data: { refreshToken: refresh_token },
    });

    return {
      message: 'Login successful',
      access_token,
      refresh_token,
      user: {
        uuid: user.uuid,
        email: user.email,
        phone: user.phone,
      },
    };

  } catch (error) {
    console.error('Login error ➤', error);

    // Controlled response
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new Error('Login failed. Please try again later.');
  }
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
      console.log("regreshed");
        try {
            const payload = this.jwtService.verify(token);

            const user = await this.prisma.clinicUser.findFirst({
               where: { uuid: payload.sub },
            });

            if (!user || user.refreshToken !== token) {
            throw new UnauthorizedException('Invalid refresh token');
            }

            const newAccessToken = this.jwtService.sign(
            { email: user.email, sub: user.uuid },
            { expiresIn: '1d' }
            );

            return { access_token: newAccessToken };
        } catch {
            throw new UnauthorizedException('Refresh token expired or invalid');
        }
        }


        
        async logout(userId: string) {
            console.log("userId",userId);
            await this.prisma.clinicUser.updateMany({
                where: { uuid: String(userId) },
                data: { refreshToken: null },
            });
            return { message: 'Logged out successfully' };
        }




    async verifyToken(token: string) {
        try
        {
            const payload = this.jwtService.verify(token); 
            const user = await this.prisma.clinicUser.findFirst({ where: { uuid: payload.sub } });
            if (!user) throw new UnauthorizedException('User not found');
            return { id: user.id, email: user.email, phone: user.phone };
        }
        catch (err)
        {
            throw new UnauthorizedException('Invalid or expired token');
        }
        
    }


    async getClinicProfile(id: string) {

      const data = await this.prisma.clinicUser.findFirst({
        where : {
          uuid : id
        }
      });

      return {
        status : 200,
        data : data
      }

    }



    async updateClinicAccount(id: any, dto: updateClinicUser) {

          this.businessclinic.validID(id);


          
              const updateProfile = await this.prisma.clinicUser.updateMany({
                where: {
                  uuid: id
                },
                data: {
                  firstname: dto.firstname,
                  lastname: dto.lastname,
                  phone: dto.phone,
                }
              });

          


          return {
            status : 200,
            message : "Profile updated successfully"
          }


    }
        


}