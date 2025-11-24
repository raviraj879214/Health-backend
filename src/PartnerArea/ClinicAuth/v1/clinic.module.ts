import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { ClinicAuthController } from './clinicauth.controller';
import { ClinicService } from './clinic.services';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from '../JwtStrategy/jwt.strategy';
import { CLINIC_AUTH_SERVICE_V1 } from '../constant/clinic.constant';
import { clinicAuthBusiness } from './business/clinicauth.business';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' }, // default expiry
      }),
    }),
  ],

  controllers: [ClinicAuthController],

  providers: [
    {
      provide: CLINIC_AUTH_SERVICE_V1,
      useClass: ClinicService,
    },
    PrismaService,
    JwtStrategy,
    clinicAuthBusiness
  ],

  exports: [CLINIC_AUTH_SERVICE_V1],
})
export class ClinicAuthModule {}
