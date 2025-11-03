// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {




  
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  
  login(@Body() dto: LoginDto) {

    console.log("NODE_ENV:", process.env.NODE_ENV);
      console.log("DB:", process.env.DATABASE_URL);

    return this.authService.login(dto);

    
  }






}
