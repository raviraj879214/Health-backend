import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClinicAuthController } from './clinicauth.controller';
import { ClinicService } from './clinic.services';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from '../JwtStrategy/jwt.strategy';
import { CLINIC_AUTH_SERVICE_V1 } from '../constant/clinic.constant';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // ✔ JWT Registered here
    JwtModule.register({
      secret: process.env.JWT_SECRET,        
    }),
  ],

  controllers: [ClinicAuthController],

  providers: [
    // ✔ Bind interface token to ClinicService
    {
      provide: CLINIC_AUTH_SERVICE_V1,
      useClass: ClinicService,
    },

    PrismaService,
    JwtStrategy, // Required for verifying tokens
  ],

  // ✔ Export only token, not entire service class
  exports: [CLINIC_AUTH_SERVICE_V1],
})
export class ClinicAuthModule {}
