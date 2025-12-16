


import { Controller, Post, Body, Version, Inject, Get, UseGuards, Request, UnauthorizedException, Req } from '@nestjs/common';
import { ClinicService } from './clinic.services';
import { CLINIC_AUTH_SERVICE_V1 } from '../constant/clinic.constant';
import { JwtAuthGuard } from 'src/PartnerArea/AuthGuard/jwt-auth.guard';
import { updateClinicUser } from './dto/clinic.update.dt';


@Controller('clinic-auth')
export class ClinicAuthController {


  constructor(@Inject(CLINIC_AUTH_SERVICE_V1) private auth: ClinicService) { }



  @Post('login')
  @Version("1")
  async login(@Body() body: { email: string; password: string }) {


    console.log("email", body.email, "password", body.password);
    return this.auth.login(body.email, body.password);

  }

  @Post('register')
  @Version("1")
  async register(@Body() body: { email: string; password: string; phone?: string }) {

    return this.auth.createClinicUser(body);
  }



  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Version("1")
  getProfile(@Request() req) {

    return {
      message: 'JWT Protected Route Working!',
      user: req.user
    };
  }


  @Post('refresh')
  @Version("1")
  async refresh(@Body('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return this.auth.refresh(token);
  }


  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @Version("1")
  async logout(@Request() req) {
    const userId = req.user.id;
    console.log("userId logout", req.user);
    return this.auth.logout(userId);
  }




  @Get('verify')
  @Version("1")
  async verifyToken(@Req() req) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }
      const token = authHeader.split(' ')[1];
      const payload = await this.auth.verifyToken(token);


      return {
        status: 200,
        valid: true,
        user: payload,
      };
    } catch (err) {

      return {
        status: 401,
        valid: false,
        message: err.message || 'Invalid token',
      };
    }
  }


   @UseGuards(JwtAuthGuard)
   @Get("/get-clinic-profile")
   @Version("1")
   async fetchClinicProfile(@Req() req){

      console.log("req.user.id",req.user.id);
      return this.auth.getClinicProfile(req.user.id);
   }


  @UseGuards(JwtAuthGuard)
  @Post("/update-profile")
  @Version("1")
  async updateClinicProfile(@Req() req,@Body() dto:updateClinicUser){
    console.log("req.user.id",req.user.id);
    console.log("dto",dto);
    return this.auth.updateClinicAccount(req.user.id,dto);
  }




  @Post("/partner-forgot-password")
  @Version("1")
  async partnerForgotPassword(@Body("email") email:string) {
    

    return this.auth.partnerForgot(email);
  }

    @Post("/partner-reset-verify")
    @Version("1")
    async partnerResetVerify(@Body("resettoken") resettoken: string) {
      try {
        const payload = await this.auth.verifyToken(resettoken);

        const tokenExists = await this.auth.checkresetTokenExist(resettoken, payload.email);

        if (tokenExists) {
          return { valid: true, payload };
        } else {
          return { valid: false };
        }
      } catch (error) {
        console.error("Reset verification error:", error);
        return { valid: false };
      }
    }





    @Post("/partner-reset-password")
    @Version("1")
    async partnerResetPasswords(@Body("email") email: string,@Body("password") password: string) {



      return this.auth.resetPassword(email,password);
    }






















}
